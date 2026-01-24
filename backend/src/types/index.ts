import { Request, Response, NextFunction } from 'express';

/**
 * User payload attached to authenticated requests
 */
export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
    user?: AuthUser | null;
}

/**
 * JWT Token Payload
 */
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T | null;
    errors: ValidationError[] | null;
}

/**
 * Validation error structure
 */
export interface ValidationError {
    field: string;
    message: string;
    location: 'body' | 'query' | 'params';
    code: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
    pagination: PaginationMeta;
}

/**
 * Express middleware type with AuthenticatedRequest
 */
export type AuthMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => void | Promise<void>;

/**
 * Zod validation schema structure
 */
export interface ValidationSchema {
    body?: import('zod').ZodType;
    query?: import('zod').ZodType;
    params?: import('zod').ZodType;
}
