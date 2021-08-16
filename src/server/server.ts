import initialize, {
  FastifyInstance,
  FastifyServerOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import mercurius from "mercurius";

import type { Context } from "./context";

import shutdownPlugin from "./plugins/shutdown";
import statusPlugin from "./plugins/status";
import prismaPlugin from "./plugins/prisma";
import { schema } from "./schema";

export function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = initialize(opts);

  server.register(shutdownPlugin);
  server.register(statusPlugin);
  server.register(prismaPlugin);

  server.register(mercurius, {
    schema,
    path: "/graphql",
    graphiql: true,
    context: (request: FastifyRequest, reply: FastifyReply): Context => {
      return {
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
