import { randomBytes } from "crypto";
import _ from "lodash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { addDays, differenceInSeconds } from "date-fns";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { PrismaClient, User, Session } from "@prisma/client";
import type { Maybe, TokenPayload, RefreshTokenPayload, SessionData } from "lib/interfaces";

import { JWT_SECRET, DOMAIN, BCRYPT_SALT_ROUNDS } from "lib/constants";
import { NotAuthorized, LoginFailed } from "lib/errors";

const isDev = process.env.NODE_ENV !== "production";
const secure = !isDev;
const sameSite = isDev ? "lax" : "strict";

export function verifyPassword(password: string, passwordDigest: string): Promise<boolean> {
  return bcrypt.compare(password, passwordDigest);
}

export function createPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function login({
  prisma,
  request,
  reply,
  email,
  password,
}: {
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
  email: string;
  password: string;
}): Promise<{ token: string; tokenExpires: Date }> {
  const refreshToken = await getRefreshToken(request);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      passwordDigest: true,
      roles: true,
    },
  });

  if (!(user && (await verifyPassword(password, user.passwordDigest)))) throw LoginFailed();

  // It's possible someone attempts to login after someone else in the same client
  // Or someone could have stolen the refresh token cookie.
  const session =
    !refreshToken || refreshToken.userId !== user.id
      ? await createSession({ prisma, request, user })
      : await refreshSession({ prisma, id: refreshToken.sessionId });

  await setRefreshToken({
    reply,
    payload: {
      userId: user.id,
      sessionId: session.id,
      sessionToken: session.token,
    },
  });

  return createAccessToken(session.id);
}

export async function refresh({
  prisma,
  request,
  reply,
}: {
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
}): Promise<{ token: string; tokenExpires: Date }> {
  const refreshToken = await getRefreshToken(request);
  if (!refreshToken) {
    clearRefreshToken(reply);
    reply.statusCode = 401;
    throw new NotAuthorized();
  }
  const {
    id: sessionId,
    token: sessionToken,
    userId,
  } = await refreshSession({ prisma, id: refreshToken.sessionId });
  await setRefreshToken({ reply, payload: { sessionId, sessionToken, userId } });
  return createAccessToken(sessionId);
}

export const authenticate = async (
  server: FastifyInstance,
  request: FastifyRequest
): Promise<Maybe<SessionData>> => {
  if (!(request.headers && request.headers.authorization)) return null;

  const [scheme, credentials] = request.headers.authorization.split(" ");

  if (!scheme || !/^Bearer$/i.test(scheme)) return null;

  try {
    const payload = await jwtVerify(credentials);

    if (!isTokenPayload(payload)) return null;

    const { sessionId } = payload;

    // TODO lookup session data with redis

    const data = await server.prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        valid: true,
        token: true,
        user: {
          select: {
            id: true,
            roles: true,
          },
        },
      },
    });

    if (data && data.valid) {
      return {
        user: data.user,
        session: {
          id: data.id,
          token: data.token,
        },
      };
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      request.log.error(`Authorization error: ${error.message}`);
    }
    return null;
  }
};

function createSession({
  prisma,
  request,
  user,
}: {
  prisma: PrismaClient;
  request: FastifyRequest;
  user: Pick<User, "id">;
}): Promise<Pick<Session, "id" | "token">> {
  return prisma.session.create({
    data: {
      userId: user.id,
      token: generateToken(),
      ip: request.ip,
      userAgent: request.headers["user-agent"] || "",
    },
    select: { id: true, token: true },
  });
}

function refreshSession({
  prisma,
  id,
}: {
  prisma: PrismaClient;
  id: number;
}): Promise<Pick<Session, "id" | "token" | "userId">> {
  return prisma.session
    .update({
      where: { id },
      data: { token: generateToken() },
      select: { token: true, userId: true },
    })
    .then(({ token, userId }) => {
      return { id, token, userId };
    });
}

async function getRefreshToken(request: FastifyRequest): Promise<RefreshTokenPayload | undefined> {
  if (request.headers.cookie) {
    const { refreshToken } = cookie.parse(request.headers.cookie);
    if (typeof refreshToken === "string") {
      try {
        const payload = await jwtVerify(refreshToken);
        if (isRefreshTokenPayload(payload)) {
          return payload;
        }
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }
  }
}

async function setRefreshToken({
  reply,
  payload,
}: {
  reply: FastifyReply;
  payload: RefreshTokenPayload;
}): Promise<void> {
  const now = new Date();
  const expires = addDays(now, 30);
  const expiresIn = differenceInSeconds(expires, now);
  const refreshTokenJwt = await jwtSign(payload, { expiresIn });
  setCookies(reply, [
    { name: "refreshToken", value: refreshTokenJwt, options: { expires } },
    {
      name: "refreshTokenExpires",
      value: expires.toISOString(),
      options: { expires, httpOnly: false },
    },
  ]);
}

function clearRefreshToken(reply: FastifyReply): void {
  /**
   * NOTE: from http://expressjs.com/en/api.html#res.clearCookie
   * Web browsers and other compliant clients will only clear the cookie if the given options
   * are identical to those given to res.cookie(), excluding expires and maxAge.
   */
  const expires = new Date(0);
  setCookies(reply, [
    { name: "refreshToken", value: "", options: { expires } },
    { name: "refreshTokenExpires", value: "", options: { expires, httpOnly: false } },
  ]);
}

function createAccessToken(sessionId: number): { token: string; tokenExpires: Date } {
  const token = jwt.sign({ sessionId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { token, tokenExpires: new Date(Date.now() + 1000 * 60 * 15) };
}

// function setCookie(
//   reply: FastifyReply,
//   name: string,
//   value: string,
//   options?: cookie.CookieSerializeOptions
// ): void {
//   const cookieOptions: cookie.CookieSerializeOptions = Object.assign(
//     { path: "/", domain: DOMAIN, httpOnly: true, secure, sameSite },
//     options
//   );
//   reply.header("Set-Cookie", cookie.serialize(name, value, cookieOptions));
// }

function setCookies(
  reply: FastifyReply,
  cookies: Array<{ name: string; value: string; options?: cookie.CookieSerializeOptions }>
): void {
  const serialized = cookies.map(({ name, value, options }) => {
    const cookieOptions: cookie.CookieSerializeOptions = Object.assign(
      { path: "/", domain: DOMAIN, httpOnly: true, secure, sameSite },
      options
    );
    return cookie.serialize(name, value, cookieOptions);
  });
  reply.header("Set-Cookie", serialized);
}

function jwtSign(
  payload: string | object | Buffer, // eslint-disable-line @typescript-eslint/ban-types
  options: jwt.SignOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (err, token) => {
      if (err) return reject(err);
      if (token) return resolve(token);
      reject(new Error("Unable to create JSON web token"));
    });
  });
}

function jwtVerify(token: string, options: jwt.VerifyOptions = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, options, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      if (decoded) {
        resolve(decoded);
        return;
      }
      reject(new Error("Unable to verify JSON web token"));
    });
  });
}

/**
 *
 * @param {number} length Should be an even number
 * @returns {string} The token
 */
function generateToken(length = 40): string {
  return randomBytes(length / 2).toString("hex");
}

export function isTokenPayload(value: unknown): value is TokenPayload {
  return _.isObject(value) && typeof (value as unknown as TokenPayload)?.sessionId === "number";
}

function isRefreshTokenPayload(value: unknown): value is RefreshTokenPayload {
  return (
    _.isObject(value) &&
    typeof (value as unknown as RefreshTokenPayload)?.sessionId === "number" &&
    typeof (value as unknown as RefreshTokenPayload)?.sessionToken === "string"
  );
}
