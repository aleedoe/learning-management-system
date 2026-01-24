/**
 * Error Handling Middleware
 * Centralized error handler for consistent error responses
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import config from '../config';
import { AuthenticatedRequest, ApiResponse } from '../types';

interface ErrorWithStatusCode extends Error {
    statusCode?: number;
}

interface ErrorResponsePayload extends ApiResponse<null> {
    stack?: string;
}

/**
 * Convert non-ApiError errors to ApiError
 */
export const errorConverter: ErrorRequestHandler = (
    err: ErrorWithStatusCode,
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        const apiError = new ApiError(statusCode, message, null, false);
        apiError.stack = err.stack;
        return next(apiError);
    }

    next(error);
};

/**
 * Handle and respond to errors
 */
export const errorHandler: ErrorRequestHandler = (
    err: ApiError,
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
): void => {
    const { statusCode, message, errors, isOperational, stack } = err;

    // Log error
    const logData = {
        statusCode,
        message,
        errors,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
    };

    if (!isOperational) {
        logger.error('Unhandled error:', { ...logData, stack });
    } else {
        logger.warn('Operational error:', logData);
    }

    // Build response
    const responsePayload: ErrorResponsePayload = {
        success: false,
        message: isOperational ? message : 'Internal Server Error',
        data: null,
        errors: errors,
    };

    // Include stack trace in development
    if (config.env === 'development' && !isOperational) {
        responsePayload.stack = stack;
    }

    res.status(statusCode).json(responsePayload);
};

/**
 * Handle 404 Not Found
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
