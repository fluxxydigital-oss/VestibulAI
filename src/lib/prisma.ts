import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Retorna uma instância singleton do PrismaClient.
 * Usa lazy initialization para não instanciar durante o build do Next.js.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Bypass SSL certificate verification for development
      },
    });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
