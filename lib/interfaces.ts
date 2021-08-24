import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Redis } from "ioredis";

import { Role } from "@prisma/client";

export type Maybe<T> = T | null;

export interface Context {
  redis: Redis;
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
}

export interface AccessToken {
  token: string;
  tokenExpires: string;
}

export interface TokenPayload {
  sessionId: number;
}

export interface RefreshTokenPayload {
  userId: number;
  sessionId: number;
  sessionToken: string;
}

export interface SessionData {
  user: {
    id: number;
    roles: Role[];
  };
  session: {
    id: number;
    token: string;
  };
}
