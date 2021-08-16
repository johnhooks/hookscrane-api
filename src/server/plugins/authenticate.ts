import { authenticate } from "$lib/security";

import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import { Maybe, SessionData } from "$lib/interfaces";

declare module "fastify" {
  interface FastifyRequest {
    session: Maybe<SessionData>;
  }
}

const authenticatePlugin: FastifyPluginAsync = fp(
  async (server, _options) => {
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
