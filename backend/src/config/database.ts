/**
 * Database Configuration
 * Prisma client singleton for PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

// Create Prisma client with logging
const prisma = new PrismaClient({
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
