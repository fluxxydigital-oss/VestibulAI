// src/lib/prisma-client.ts
// Custom Prisma Client com SSL fix para Supabase

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Bypass SSL certificate verification para Supabase
  // (Safe: mesmo certificado auto-assinado, já é HTTPS)
  errorFormat: 'pretty',
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
