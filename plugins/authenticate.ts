import { authenticate } from "lib/security";

import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

const authenticatePlugin: FastifyPluginAsync = fp(
  async (server, _options) => {
    /**
     * NOTE: The FastifyRequest interface is extended in types/fastify/index.d.ts
     */
    server.decorateRequest("session", null);

    server.addHook("onRequest", async request => {
      request.session = await authenticate(request);
    });
  },
  {
    fastify: "3.x",
    decorators: {
      fastify: ["prisma", "redis"],
    },
    dependencies: ["fastify-redis", "prisma-plugin"],
    name: "authenticate-plugin",
  }
);

export default authenticatePlugin;
