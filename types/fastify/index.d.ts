import type { PrismaClient } from "@prisma/client";

import type { Maybe, SessionData } from "../../lib/interfaces";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    session: Maybe<SessionData>;
  }
}
