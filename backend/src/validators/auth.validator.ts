/**
 * Auth Validators
 * Zod schemas for authentication request validation
 */

import { z } from 'zod';
import { Role } from '@prisma/client';
import { ValidationSchema } from '../types';

/**
 * Register body schema
 */
const registerBodySchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z
        .string({
            required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters'),
    firstName: z
        .string({
            required_error: 'First name is required',
        })
        .min(1, 'First name is required')
        .max(50, 'First name must not exceed 50 characters')
        .trim(),
    lastName: z
        .string({
            required_error: 'Last name is required',
        })
        .min(1, 'Last name is required')
        .max(50, 'Last name must not exceed 50 characters')
        .trim(),
    role: z
        .nativeEnum(Role, {
            errorMap: () => ({
                message: 'Role must be ADMIN, INSTRUCTOR, or STUDENT',
            }),
        })
        .optional()
        .default(Role.STUDENT),
});

/**
 * Login body schema
 */
const loginBodySchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z
        .string({
            required_error: 'Password is required',
        })
        .min(1, 'Password is required'),
});

/**
 * Register request validation schema
 */
export const registerSchema: ValidationSchema = {
    body: registerBodySchema,
};

/**
 * Login request validation schema
 */
export const loginSchema: ValidationSchema = {
    body: loginBodySchema,
};

/**
 * Inferred types from schemas
 */
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
