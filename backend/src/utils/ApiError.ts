/**
 * Custom API Error Class
 * Centralized error handling with HTTP status codes
 */

import { ValidationError } from '../types';

class ApiError extends Error {
    public statusCode: number;
    public errors: ValidationError[] | null;
    public isOperational: boolean;
    public timestamp: string;

    constructor(
        statusCode: number,
        message: string,
        errors: ValidationError[] | null = null,
        isOperational: boolean = true
    ) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }

    // Factory methods for common errors
    static badRequest(message: string = 'Bad Request', errors: ValidationError[] | null = null): ApiError {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = 'Resource not found'): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string = 'Conflict'): ApiError {
        return new ApiError(409, message);
    }

    static unprocessableEntity(message: string = 'Unprocessable Entity', errors: ValidationError[] | null = null): ApiError {
        return new ApiError(422, message, errors);
    }

    static tooManyRequests(message: string = 'Too many requests'): ApiError {
        return new ApiError(429, message);
    }

    static internal(message: string = 'Internal Server Error'): ApiError {
        return new ApiError(500, message, null, false);
    }
}

export default ApiError;
