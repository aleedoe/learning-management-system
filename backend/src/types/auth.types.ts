/**
 * Authentication Types
 * DTOs and interfaces for authentication module
 */

import { Role } from '@prisma/client';

/**
 * Parameters for creating a new user in repository
 */
export interface CreateUserParams {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: Role;
}

/**
 * Clean User DTO - NEVER contains password hash
 * This is what gets returned to clients
 */
export interface UserDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: Role;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Authentication response with user and token
 */
export interface AuthResponse {
    user: UserDTO;
    token: string;
}

/**
 * Register input from validated request
 */
export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}

/**
 * Login input from validated request
 */
export interface LoginInput {
    email: string;
    password: string;
}
