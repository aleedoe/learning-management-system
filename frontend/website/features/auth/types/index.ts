import { z } from 'zod';

/**
 * User Role Enum
 * Matches backend Role enum from schema.prisma
 */
export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

/**
 * User Interface
 * Matches backend UserDTO from auth.types.ts
 * Derived from schema.prisma User model (excluding passwordHash)
 */
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: UserRole;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * API Response Wrapper
 * Standard response format from backend
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
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
 * Matches backend registerSchema validator fields.
 */
export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(1, 'First name is required')
            .min(2, 'First name must be at least 2 characters'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .min(2, 'Last name must be at least 2 characters'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        role: z.enum(['INSTRUCTOR', 'STUDENT']).default('STUDENT'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Auth Response Data
 * Data payload from login/register endpoints
 */
export interface AuthResponseData {
    user: User;
    token: string;
}

/**
 * Login Response
 * Response from POST /auth/login
 */
export type LoginResponse = ApiResponse<AuthResponseData>;

/**
 * Register Response
 * Response from POST /auth/register
 */
export type RegisterResponse = ApiResponse<AuthResponseData>;

/**
 * Get Me Response
 * Response from GET /auth/me
 */
export type GetMeResponse = ApiResponse<User>;

/**
 * Auth Error Response
 * Error response from auth endpoints
 */
export interface AuthErrorResponse {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}
