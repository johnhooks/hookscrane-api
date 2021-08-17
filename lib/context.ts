import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Redis } from "ioredis";

export interface Context {
  redis: Redis;
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
}
