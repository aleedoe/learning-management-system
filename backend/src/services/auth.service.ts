/**
 * Auth Service
 * Business logic layer for authentication
 * NEVER accesses Prisma directly - uses Repository layer
 */

import { User, Role } from '@prisma/client';
import * as authRepository from '../repositories/auth.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import {
    UserDTO,
    AuthResponse,
    RegisterInput,
    LoginInput,
} from '../types/auth.types';

/**
 * Map raw Prisma User to clean UserDTO
 * CRITICAL: This removes the passwordHash from the response
 */
const toUserDTO = (user: User): UserDTO => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

/**
 * Generate JWT token for user
 */
const generateToken = (user: User): string => {
    return generateAccessToken({
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    });
};

/**
 * Register a new user
 * @returns AuthResponse with clean UserDTO and token
 */
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(input.email);

    if (existingUser) {
        throw ApiError.conflict('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user via repository
    const user = await authRepository.createUser({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role || Role.STUDENT,
    });

    logger.info(`New user registered: ${user.email}`);

    // Generate token
    const token = generateToken(user);

    // Return clean DTO (no password hash!)
    return {
        user: toUserDTO(user),
        token,
    };
};

/**
 * Login user
 * @returns AuthResponse with clean UserDTO and token
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
    // Find user by email
    const user = await authRepository.findUserByEmail(input.email);

    if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
        throw ApiError.forbidden('Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login timestamp
    await authRepository.updateLastLogin(user.id);

    logger.info(`User logged in: ${user.email}`);

    // Generate token
    const token = generateToken(user);

    // Return clean DTO (no password hash!)
    return {
        user: toUserDTO(user),
        token,
    };
};

/**
 * Get current user by ID
 * @returns Clean UserDTO
 */
export const getUserById = async (id: number): Promise<UserDTO> => {
    const user = await authRepository.findUserById(id);

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    if (!user.isActive) {
        throw ApiError.forbidden('Account has been deactivated');
    }

    // Return clean DTO (no password hash!)
    return toUserDTO(user);
};
