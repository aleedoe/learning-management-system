/**
 * Express Application Setup
 * Main application configuration and middleware setup
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import routes from './routes';
import swaggerSpec from './config/swagger';
import logger from './utils/logger';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import {
    errorConverter,
    errorHandler,
    notFoundHandler,
} from './middlewares/error.middleware';
// AppError classes available from: './utils/AppError'
// asyncHandler wrapper available from: './utils/asyncHandler'

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
});

// Rate limiting
app.use(config.apiPrefix, apiLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Learning Management System API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// API routes
app.use(config.apiPrefix, routes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Learning Management System API Server',
        data: {
            version: '1.0.0',
            documentation: '/api-docs',
            health: '/api/health',
        },
        errors: null,
    });
});

// Handle 404 - Route not found
app.use(notFoundHandler);

// Error handling
app.use(errorConverter);
app.use(errorHandler);

export default app;
