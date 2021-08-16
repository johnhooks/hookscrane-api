import { PrismaClient } from "@prisma/client";

export async function connect(): Promise<PrismaClient> {
  const prisma = new PrismaClient({
    log: ["query", `warn`, `error`],
  });

  await prisma.$connect();

  return prisma;
}
