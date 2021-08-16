import _ from "lodash";
import jwt from "jsonwebtoken";

// import type { User } from "@prisma/client";
import type { Maybe, TokenPayload, SessionData } from "./interfaces";
import type { Context } from "./context";

import { JWT_SECRET } from "./constants";

export const authenticate = async (ctx: Context): Promise<Maybe<SessionData>> => {
  if (!(ctx.request.headers && ctx.request.headers.authorization)) return null;

  const [scheme, credentials] = ctx.request.headers.authorization.split(" ");

  if (!scheme || !/^Bearer$/i.test(scheme)) return null;

  try {
    const payload = jwt.verify(credentials, JWT_SECRET);

    if (!isTokenPayload(payload)) return null;

    const { sessionId } = payload;

    const data = await ctx.prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        valid: true,
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
        },
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

export function isTokenPayload(value: unknown): value is TokenPayload {
  return _.isObject(value) && (value as unknown as TokenPayload).sessionId !== undefined;
}
