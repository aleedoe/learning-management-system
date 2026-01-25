/**
 * Custom Application Error Classes
 * Provides type-safe error handling with specific HTTP status codes
 */

import { ValidationError } from '../types';

/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors: ValidationError[] | null;
    public readonly timestamp: string;

    constructor(
        statusCode: number,
        message: string,
        isOperational: boolean = true,
        errors: ValidationError[] | null = null
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.timestamp = new Date().toISOString();

        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);

        // Set prototype explicitly for extending built-in classes
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Check if error is operational (expected) vs programming error
     */
    static isOperationalError(error: Error): boolean {
        if (error instanceof AppError) {
            return error.isOperational;
        }
        return false;
    }
}

/**
 * 400 Bad Request Error
 * Use when client sends malformed or invalid data
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request', errors: ValidationError[] | null = null) {
        super(400, message, true, errors);
    }
}

/**
 * 401 Unauthorized Error
 * Use when authentication is required but missing or invalid
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
    }
}

/**
 * 403 Forbidden Error
 * Use when user is authenticated but lacks permission
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(403, message);
    }
}

/**
 * 404 Not Found Error
 * Use when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(404, message);
    }
}

/**
 * 409 Conflict Error
 * Use for unique constraint violations or resource conflicts
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(409, message);
    }
}

/**
 * 422 Unprocessable Entity Error
 * Use when request is well-formed but semantically incorrect
 */
export class UnprocessableEntityError extends AppError {
    constructor(message: string = 'Unprocessable Entity', errors: ValidationError[] | null = null) {
        super(422, message, true, errors);
    }
}

/**
 * 429 Too Many Requests Error
 * Use when rate limit is exceeded
 */
export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Too many requests, please try again later') {
        super(429, message);
    }
}

/**
 * 500 Internal Server Error
 * Use for unexpected server-side errors
 * Note: isOperational is false for these errors
 */
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal Server Error') {
        super(500, message, false);
    }
}

export default AppError;
