/**
 * Auth Repository
 * Data access layer for authentication - ONLY layer with Prisma access
 */

import { User } from '@prisma/client';
import { prisma } from '../config/database';
import { CreateUserParams } from '../types/auth.types';

/**
 * Find user by email
 * @returns Raw Prisma User or null
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { email },
    });
};

/**
 * Find user by ID
 * @returns Raw Prisma User or null
 */
export const findUserById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { id },
    });
};

/**
 * Create a new user
 * @returns Raw Prisma User
 */
export const createUser = async (data: CreateUserParams): Promise<User> => {
    return prisma.user.create({
        data: {
            email: data.email,
            passwordHash: data.passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        },
    });
};

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = async (id: number): Promise<User> => {
    return prisma.user.update({
        where: { id },
        data: { lastLoginAt: new Date() },
    });
};
