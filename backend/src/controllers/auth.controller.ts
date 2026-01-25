/**
 * Auth Controller
 * HTTP request/response handlers for authentication
 * Returns clean DTOs, never raw DB objects
 */

import { Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { success, created } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { RegisterBody, LoginBody } from '../validators/auth.validator';

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const body = req.body as RegisterBody;

        const result = await authService.register({
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            role: body.role,
        });

        created(res, result, 'User registered successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const body = req.body as LoginBody;

        const result = await authService.login({
            email: body.email,
            password: body.password,
        });

        success(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

/**
 * Get current authenticated user
 * GET /auth/me
 */
export const me = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // User ID comes from auth middleware
        const userId = parseInt(req.user!.id, 10);

        const user = await authService.getUserById(userId);

        success(res, user, 'User retrieved successfully');
    } catch (error) {
        next(error);
    }
};
