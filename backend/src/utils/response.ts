/**
 * API Response Helper
 * Standardized response format for consistency
 */

import { Response } from 'express';
import { ApiResponse, PaginatedApiResponse, ValidationError } from '../types';

/**
 * Success response
 */
export const success = <T>(
    res: Response,
    data: T | null = null,
    message: string = 'Success',
    statusCode: number = 200
): Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        errors: null,
    });
};

/**
 * Created response (201)
 */
export const created = <T>(
    res: Response,
    data: T | null = null,
    message: string = 'Resource created successfully'
): Response<ApiResponse<T>> => {
    return success(res, data, message, 201);
};

/**
 * No content response (204)
 */
export const noContent = (res: Response): Response => {
    return res.status(204).send();
};

/**
 * Error response
 */
export const error = (
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    errors: ValidationError[] | null = null
): Response<ApiResponse<null>> => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        errors,
    });
};

interface PaginationInput {
    page: number;
    limit: number;
    total: number;
}

/**
 * Paginated response
 */
export const paginated = <T>(
    res: Response,
    data: T[],
    pagination: PaginationInput,
    message: string = 'Success'
): Response<PaginatedApiResponse<T>> => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages,
            hasNextPage: pagination.page < totalPages,
            hasPrevPage: pagination.page > 1,
        },
        errors: null,
    });
};
