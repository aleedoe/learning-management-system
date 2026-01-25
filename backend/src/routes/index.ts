/**
 * Routes Index
 * Aggregates all route modules
 */

import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';

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

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);

export default router;

