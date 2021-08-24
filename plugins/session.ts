import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Static, Type } from "@sinclair/typebox";

import { login, refresh, authenticate } from "lib/security";

const LoginBody = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

const AccessToken = Type.Object({
  token: Type.String(),
  tokenExpires: Type.String(),
});

type LoginBodyType = Static<typeof LoginBody>;
type AccessTokenType = Static<typeof AccessToken>;

const sessionPlugin: FastifyPluginAsync = fp(
  async (server, _options) => {
    /**
     * NOTE: The FastifyRequest interface is extended in types/fastify/index.d.ts
     */
    server.decorateRequest("session", null);

    server.addHook("onRequest", async request => {
      request.session = await authenticate(server, request);
    });

    server.post<{ Body: LoginBodyType; Reply: AccessTokenType }>(
      "/login",
      {
        schema: {
          body: LoginBody,
          response: {
            200: AccessToken,
          },
        },
      },
      async (request, reply) => {
        const { token, tokenExpires } = await login({
          prisma: server.prisma,
          request,
          reply,
          email: request.body.email,
          password: request.body.password,
        });
        reply.status(200).send({ token, tokenExpires: tokenExpires.toISOString() });
      }
    );

    server.post<{ Body: never; Reply: AccessTokenType }>(
      "/refresh",
      {
        schema: {
          body: {},
          response: {
            200: AccessToken,
          },
        },
      },
      async (request, reply) => {
        const { token, tokenExpires } = await refresh({
          prisma: server.prisma,
          request,
          reply,
        });
        reply.status(200).send({ token, tokenExpires: tokenExpires.toISOString() });
      }
    );
  },
  {
    fastify: "3.x",
    decorators: {
      fastify: ["prisma", "redis"],
    },
    dependencies: ["fastify-redis", "prisma-plugin"],
    name: "session-plugin",
  }
);

export default sessionPlugin;
