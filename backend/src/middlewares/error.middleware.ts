/**
 * Global Error Handling Middleware
 * Centralized error handler with support for:
 * - Custom AppError classes
 * - ZodError validation errors
 * - Prisma database errors
 * - Unknown/unexpected errors
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

import { AppError, NotFoundError } from '../utils/AppError';
import logger from '../utils/logger';
import config from '../config';
import { AuthenticatedRequest, ApiResponse, ValidationError } from '../types';

/**
 * Extended error interface for type safety
 */
interface ErrorWithStatusCode extends Error {
    statusCode?: number;
    isOperational?: boolean;
    errors?: ValidationError[] | null;
}

/**
 * Response payload interface
 */
interface ErrorResponsePayload extends ApiResponse<null> {
    stack?: string;
}

/**
 * Format ZodError into ValidationError array
 */
const formatZodError = (error: ZodError): ValidationError[] => {
    return error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        location: 'body' as const,
        code: err.code,
    }));
};

/**
 * Handle Prisma-specific errors and convert to AppError
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
    switch (error.code) {
        // Unique constraint violation
        case 'P2002': {
            const target = (error.meta?.target as string[])?.join(', ') || 'field';
            return new AppError(409, `A record with this ${target} already exists`, true);
        }

        // Record not found
        case 'P2025':
            return new AppError(404, 'Record not found', true);

        // Foreign key constraint violation
        case 'P2003': {
            const field = error.meta?.field_name as string || 'field';
            return new AppError(400, `Invalid reference: ${field}`, true);
        }

        // Required field missing
        case 'P2011': {
            const field = error.meta?.constraint as string || 'field';
            return new AppError(400, `Required field missing: ${field}`, true);
        }

        // Value too long for column
        case 'P2000':
            return new AppError(400, 'Value too long for the field', true);

        // Invalid input value
        case 'P2006':
            return new AppError(400, 'Invalid input value', true);

        // Database connection error
        case 'P1001':
        case 'P1002':
            return new AppError(503, 'Database connection error', false);

        default:
            logger.warn(`Unhandled Prisma error code: ${error.code}`, { meta: error.meta });
            return new AppError(500, 'Database error occurred', false);
    }
};

/**
 * Error Converter Middleware
 * Converts various error types to AppError for consistent handling
 */
export const errorConverter: ErrorRequestHandler = (
    err: ErrorWithStatusCode,
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {
    let error: AppError;

    // Already an AppError - pass through
    if (err instanceof AppError) {
        return next(err);
    }

    // ZodError - Validation failed
    if (err instanceof ZodError) {
        const validationErrors = formatZodError(err);
        error = new AppError(400, 'Validation failed', true, validationErrors);
        error.stack = err.stack;
        return next(error);
    }

    // Prisma Known Request Error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(err);
        error.stack = err.stack;
        return next(error);
    }

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        error = new AppError(400, 'Invalid data provided to database', true);
        error.stack = err.stack;
        return next(error);
    }

    // Prisma Initialization Error (DB connection issues)
    if (err instanceof Prisma.PrismaClientInitializationError) {
        error = new AppError(503, 'Database connection failed', false);
        error.stack = err.stack;
        return next(error);
    }

    // Generic error - convert to AppError
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const isOperational = err.isOperational ?? false;

    error = new AppError(statusCode, message, isOperational);
    error.stack = err.stack;

    next(error);
};

/**
 * Error Handler Middleware
 * Final error handler that sends response to client
 */
export const errorHandler: ErrorRequestHandler = (
    err: AppError,
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
): void => {
    const { statusCode, message, errors, isOperational, stack } = err;

    // Prepare log data
    const logData = {
        statusCode,
        message,
        errors,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
        userAgent: req.get('user-agent'),
    };

    // Log based on error type
    if (!isOperational) {
        // Unexpected errors - log with full stack trace
        logger.error('Unhandled error:', { ...logData, stack });
    } else if (statusCode >= 500) {
        // Server errors
        logger.error('Server error:', logData);
    } else if (statusCode >= 400) {
        // Client errors - less severe
        logger.warn('Client error:', logData);
    }

    // Build response payload
    const responsePayload: ErrorResponsePayload = {
        success: false,
        message: isOperational ? message : 'Internal Server Error',
        data: null,
        errors: errors || null,
    };

    // Include stack trace in development for unexpected errors
    if (config.env === 'development' && !isOperational && stack) {
        responsePayload.stack = stack;
    }

    res.status(statusCode).json(responsePayload);
};

/**
 * 404 Not Found Handler
 * Catches unmatched routes
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
