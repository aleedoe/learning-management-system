/**
 * Routes Index
 * Aggregates all route modules
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'API is healthy',
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        },
        errors: null,
    });
});

// Mount routes here
// Example: router.use('/users', userRoutes);
// Example: router.use('/courses', courseRoutes);

export default router;
