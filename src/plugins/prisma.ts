import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import prisma from "../lib/prisma-client";

const prismaPlugin: FastifyPluginAsync = fp(
  async (server, _options) => {
    await prisma.$connect();

    /**
     * NOTE: The FastifyInstance interface is extended in types/fastify/index.d.ts
     */
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
