import initialize, {
  FastifyInstance,
  FastifyServerOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import mercurius from "mercurius";
import fastifyCors from "fastify-cors";
import fastifyRedis from "fastify-redis";
import type { Context } from "lib/context";

import sessionPlugin from "plugins/session";
import shutdownPlugin from "plugins/shutdown";
import statusPlugin from "plugins/status";
import prismaPlugin from "plugins/prisma";
import { schema } from "schema";
import { REDIS_PASSWORD } from "lib/constants";

export function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = initialize(opts);

  server.register(fastifyRedis, { host: "127.0.0.1", password: REDIS_PASSWORD });
  server.register(fastifyCors, { origin: "https://hooks.app.local", credentials: true });
  server.register(shutdownPlugin);
  server.register(statusPlugin);
  server.register(prismaPlugin);
  server.register(sessionPlugin);

  server.register(mercurius, {
    schema,
    path: "/graphql",
    graphiql: true,
    context: async (request: FastifyRequest, reply: FastifyReply): Promise<Context> => {
      return {
        redis: server.redis,
        prisma: server.prisma,
        request,
        reply,
      };
    },
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer({
    logger: {
      prettyPrint: process.env.NODE_ENV !== "production",
    },
    disableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== "true",
  });

  try {
    const PORT = process.env.PORT || 5000;
    await server.listen(PORT, "0.0.0.0");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}
