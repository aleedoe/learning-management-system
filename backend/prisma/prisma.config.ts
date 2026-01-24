/**
 * Prisma Configuration for Prisma 7+
 * Connection URL configuration for Prisma Migrate
 */

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma',

    migrations: {
        path: './prisma/migrations',
    },

    datasource: {
        url: env('DATABASE_URL'),
    },
});
