/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError } from 'zod';
import ApiError from '../utils/ApiError';
import { ValidationError, ValidationSchema } from '../types';

/**
 * Format Zod errors into a consistent structure
 */
const formatZodErrors = (error: ZodError, location: 'body' | 'query' | 'params'): ValidationError[] => {
    return error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        location,
        code: issue.code,
    }));
};

/**
 * Validate request against Zod schema
 */
export const validate = (schema: ValidationSchema): RequestHandler => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors: ValidationError[] = [];

            // Validate body
            if (schema.body) {
                const result = schema.body.safeParse(req.body);
                if (!result.success) {
                    errors.push(...formatZodErrors(result.error, 'body'));
                } else {
                    req.body = result.data;
                }
            }

            // Validate query parameters
            if (schema.query) {
                const result = schema.query.safeParse(req.query);
                if (!result.success) {
                    errors.push(...formatZodErrors(result.error, 'query'));
                } else {
                    req.query = result.data;
                }
            }

            // Validate URL parameters
            if (schema.params) {
                const result = schema.params.safeParse(req.params);
                if (!result.success) {
                    errors.push(...formatZodErrors(result.error, 'params'));
                } else {
                    req.params = result.data;
                }
            }

            if (errors.length > 0) {
                return next(ApiError.unprocessableEntity('Validation failed', errors));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
