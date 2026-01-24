/**
 * Rate Limiter Middleware
 * Prevent abuse and DDoS attacks
 */

import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import config from '../config';

/**
 * General API rate limiter
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        data: null,
        errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, _res: Response, next: NextFunction) => {
        next(ApiError.tooManyRequests('Too many requests, please try again later'));
    },
});

/**
 * Stricter rate limiter for authentication endpoints
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        data: null,
        errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (_req: Request, _res: Response, next: NextFunction) => {
        next(ApiError.tooManyRequests('Too many authentication attempts, please try again later'));
    },
});

/**
 * Rate limiter for password reset
 */
export const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again later',
        data: null,
        errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
