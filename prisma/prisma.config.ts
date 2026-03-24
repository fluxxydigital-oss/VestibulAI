import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seeds/real-data.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});