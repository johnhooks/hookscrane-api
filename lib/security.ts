import { randomBytes } from "crypto";
import _ from "lodash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { addDays, differenceInSeconds } from "date-fns";

import type { FastifyRequest } from "fastify";
import type { Role } from "@prisma/client";
import type { NexusGenFieldTypes } from "schema/generated/nexus";
import type { Maybe, TokenPayload, RefreshTokenPayload, SessionData } from "./interfaces";
import type { Context } from "./context";

import prisma from "./prisma-client";
import { JWT_SECRET, DOMAIN, BCRYPT_SALT_ROUNDS } from "./constants";
import { LoginFailed } from "lib/errors";

const isDev = process.env.NODE_ENV !== "production";
const secure = !isDev;
const sameSite = isDev ? "lax" : "strict";

interface UserData {
  id: number;
  roles: Role[];
}

type LoginResponse = NexusGenFieldTypes["LoginResponse"];

export function verifyPassword(password: string, passwordDigest: string): Promise<boolean> {
  return bcrypt.compare(password, passwordDigest);
}

export function setPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function login<Args extends { email: string; password: string }>(
  args: Args,
  ctx: Context
): Promise<LoginResponse> {
  const user = await ctx.prisma.user.findUnique({
    where: {
      email: args.email,
    },
    select: {
      id: true,
      passwordDigest: true,
      email: true,
      roles: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) throw LoginFailed();

  // dummy response
  return { token: "token", tokenExpires: new Date(1), user };
}

export const authenticate = async (request: FastifyRequest): Promise<Maybe<SessionData>> => {
  if (!(request.headers && request.headers.authorization)) return null;

  const [scheme, credentials] = request.headers.authorization.split(" ");

  if (!scheme || !/^Bearer$/i.test(scheme)) return null;

  try {
    const payload = await jwtVerify(credentials);

    if (!isTokenPayload(payload)) return null;

    const { sessionId } = payload;

    // TODO lookup session data with redis

    const data = await prisma.session.findUnique({
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
    return null;
  }
};

export async function createSession(ctx: Context, user: UserData): Promise<SessionData> {
  const session = await ctx.prisma.session.create({
    data: {
      userId: user.id,
      token: generateToken(),
      ip: ctx.request.ip,
      userAgent: ctx.request.headers["user-agent"] || "",
    },
    select: { id: true, token: true },
  });
  return { user, session };
}

export async function refreshSession(ctx: Context, sessionId: number): Promise<SessionData> {
  const { token, user } = await ctx.prisma.session.update({
    where: { id: sessionId },
    data: { token: generateToken() },
    select: { token: true, user: { select: { id: true, roles: true } } },
  });
  return { user, session: { id: sessionId, token } };
}

export async function getRefreshToken(ctx: Context): Promise<RefreshTokenPayload | undefined> {
  if (ctx.request.headers.cookie) {
    const { refreshToken } = cookie.parse(ctx.request.headers.cookie);
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

export async function setRefreshToken(ctx: Context, payload: RefreshTokenPayload): Promise<void> {
  const now = new Date();
  const refreshExpires = addDays(now, 30);
  const expiresIn = differenceInSeconds(refreshExpires, now);
  const refreshTokenJwt = await jwtSign(payload, { expiresIn });
  setCookie(ctx, "refreshToken", refreshTokenJwt, { expires: refreshExpires });
}

export function clearRefreshToken(ctx: Context): void {
  /**
   * NOTE: from http://expressjs.com/en/api.html#res.clearCookie
   * Web browsers and other compliant clients will only clear the cookie if the given options
   * are identical to those given to res.cookie(), excluding expires and maxAge.
   */
  setCookie(ctx, "refreshToken", "", { expires: new Date(0) });
}

export function setCookie(
  ctx: Context,
  name: string,
  value: string,
  options?: cookie.CookieSerializeOptions
): void {
  const cookieOptions: cookie.CookieSerializeOptions = Object.assign(
    { path: "/", domain: DOMAIN, httpOnly: true, secure, sameSite },
    options
  );
  ctx.reply.header("Set-Cookie", cookie.serialize(name, value, cookieOptions));
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
export function generateToken(length = 40): string {
  return randomBytes(length / 2).toString("hex");
}

export function isTokenPayload(value: unknown): value is TokenPayload {
  return _.isObject(value) && (value as unknown as TokenPayload).sessionId !== undefined;
}

function isRefreshTokenPayload(value: unknown): value is RefreshTokenPayload {
  return (
    typeof (value as unknown as RefreshTokenPayload)?.sessionId === "number" &&
    typeof (value as unknown as RefreshTokenPayload)?.sessionToken === "string"
  );
}
