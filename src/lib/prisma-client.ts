import { PrismaClient } from "@prisma/client";

export default new PrismaClient({
  log: ["query", `warn`, `error`],
});
