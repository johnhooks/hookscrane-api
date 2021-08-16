import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import type { PrismaClient } from "@prisma/client";

import * as prismaClient from "$lib/prisma-client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  const prisma = await prismaClient.connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async server => {
    server.log.info("disconnecting Prisma from DB");
    await server.prisma.$disconnect();
  });
});

export default prismaPlugin;
