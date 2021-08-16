import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { Maybe, SessionData } from "./interfaces";

export interface Context {
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
  session: Maybe<SessionData>; // This should be a plugin that decorates FastifyRequest
}
