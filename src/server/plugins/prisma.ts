import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import type { PrismaClient } from "@prisma/client";

import prisma from "$lib/prisma-client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(
  async (server, _options) => {
    await prisma.$connect();

    server.decorate("prisma", prisma);

    server.addHook("onClose", async server => {
      server.log.info("disconnecting Prisma from DB");
      await server.prisma.$disconnect();
    });
  },
  {
    fastify: "3.x",
    name: "prisma-plugin",
  }
);

export default prismaPlugin;
