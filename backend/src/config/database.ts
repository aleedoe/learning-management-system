/**
 * Database Configuration
 * Prisma client singleton for PostgreSQL (Prisma 7+)
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import logger from '../utils/logger';

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter with pg driver
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter and logging
const prisma = new PrismaClient({
    adapter,
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
    ],
});

// Log queries in development
prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
});

prisma.$on('error', (e) => {
    logger.error(`Prisma Error: ${e.message}`);
});

prisma.$on('warn', (e) => {
    logger.warn(`Prisma Warning: ${e.message}`);
});

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<boolean> {
    try {
        // Test connection by running a simple query
        await prisma.$connect();
        logger.info('Database connection established');
        return true;
    } catch (error) {
        logger.error('Failed to initialize database:', error);
        throw error;
    }
}

/**
 * Graceful shutdown - disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    logger.info('Database connection closed');
}

export { prisma };
