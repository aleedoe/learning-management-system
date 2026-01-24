/**
 * Server Entry Point
 * Starts the Express server with database initialization
 */

import { Server } from 'http';
import app from './app';
import config from './config';
import logger from './utils/logger';
import { initializeDatabase, disconnectDatabase } from './config/database';

// Server instance
let server: Server | null = null;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
    try {
        // Initialize database
        await initializeDatabase();
        logger.info('Database connection established');

        // Start HTTP server
        server = app.listen(config.port, () => {
            logger.info(`Server running in ${config.env} mode on port ${config.port}`);
            logger.info(`API Documentation: http://localhost:${config.port}/api-docs`);
            logger.info(`Health Check: http://localhost:${config.port}/api/health`);
        });

        // Handle server errors
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${config.port} is already in use`);
            } else {
                logger.error('Server error:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

/**
 * Graceful shutdown
 */
async function shutdown(signal: string): Promise<void> {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Close server
    if (server) {
        server.close(async () => {
            logger.info('HTTP server closed');

            // Disconnect database
            await disconnectDatabase();

            logger.info('Graceful shutdown completed');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    } else {
        process.exit(0);
    }
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();
