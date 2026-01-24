/**
 * Authentication Middleware
 * JWT token verification for protected routes
 */

import { Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../types';

/**
 * Authenticate user via JWT access token
 * Extracts token from Authorization header (Bearer scheme)
 */
export const authenticate = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw ApiError.unauthorized('Authorization header is required');
        }

        // Check Bearer scheme
        if (!authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Invalid authorization scheme. Use Bearer token');
        }

        // Extract token
        const token = authHeader.substring(7);

        if (!token) {
            throw ApiError.unauthorized('Access token is required');
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                return next(ApiError.unauthorized('Access token has expired'));
            }

            if (error.name === 'JsonWebTokenError') {
                return next(ApiError.unauthorized('Invalid access token'));
            }
        }

        logger.error('Authentication error:', error);
        next(error);
    }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that behave differently for authenticated users
 */
export const optionalAuth = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = verifyAccessToken(token);

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch {
        // For optional auth, we don't throw errors
        req.user = null;
        next();
    }
};
