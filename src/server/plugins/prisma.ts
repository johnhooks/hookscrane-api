import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  const prisma = new PrismaClient({
    log: ["query", `warn`, `error`],
  });

  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async server => {
    server.log.info("disconnecting Prisma from DB");
    await server.prisma.$disconnect();
  });
});

export default prismaPlugin;
