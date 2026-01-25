import { z } from 'zod';

/**
 * User Role Enum
 */
export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

/**
 * User Interface
 * Represents the authenticated user data.
 */
export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Login Input Schema
 * Zod validation for login form.
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register Input Schema
 * Zod validation for registration form.
 */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .min(2, 'Name must be at least 2 characters'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        role: z.enum(['INSTRUCTOR', 'STUDENT']).default('STUDENT'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login Response
 * Response from POST /auth/login
 */
export interface LoginResponse {
    token: string;
    user: User;
}

/**
 * Register Response
 * Response from POST /auth/register
 */
export interface RegisterResponse {
    message: string;
    user: User;
}

/**
 * Auth Error Response
 * Error response from auth endpoints
 */
export interface AuthErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}
