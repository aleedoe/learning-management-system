/**
 * Auth Controller
 * HTTP request/response handlers for authentication
 * Uses asyncHandler to eliminate try-catch boilerplate
 * Returns clean DTOs, never raw DB objects
 */

import { Response } from 'express';
import * as authService from '../services/auth.service';
import { success, created } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { RegisterBody, LoginBody } from '../validators/auth.validator';
import { asyncAuthHandler } from '../utils/asyncHandler';

/**
 * Register a new user
 * POST /auth/register
 */
export const register = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as RegisterBody;

    const result = await authService.register({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
    });

    created(res, result, 'User registered successfully');
});

/**
 * Login user
 * POST /auth/login
 */
export const login = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as LoginBody;

    const result = await authService.login({
        email: body.email,
        password: body.password,
    });

    success(res, result, 'Login successful');
});

/**
 * Get current authenticated user
 * GET /auth/me
 */
export const me = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    // User ID comes from auth middleware
    const userId = parseInt(req.user!.id, 10);

    const user = await authService.getUserById(userId);

    success(res, user, 'User retrieved successfully');
});
