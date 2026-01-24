/**
 * Role Authorization Middleware
 * Role-based access control for protected routes
 */

import { Response, NextFunction, RequestHandler } from 'express';
import ApiError from '../utils/ApiError';
import { ROLES, Role } from '../constants/roles';
import { AuthenticatedRequest } from '../types';

type ResourceUserIdGetter = (req: AuthenticatedRequest) => Promise<string>;

/**
 * Authorize specific roles
 */
export const authorize = (...allowedRoles: Role[]): RequestHandler => {
    return (req, _res: Response, next: NextFunction): void => {
        const authReq = req as AuthenticatedRequest;

        // Check if user is authenticated
        if (!authReq.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(authReq.user.role as Role)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Required role(s): ${allowedRoles.join(', ')}`
                )
            );
        }

        next();
    };
};

/**
 * Instructor only middleware
 */
export const instructorOnly = authorize(ROLES.INSTRUCTOR);

/**
 * Student or Instructor middleware
 */
export const studentOrInstructor = authorize(ROLES.STUDENT, ROLES.INSTRUCTOR);

/**
 * Check if user is owner or instructor
 */
export const ownerOrInstructor = (getResourceUserId: ResourceUserIdGetter): RequestHandler => {
    return async (req, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthenticatedRequest;

            if (!authReq.user) {
                return next(ApiError.unauthorized('Authentication required'));
            }

            // Instructors can access any resource
            if (authReq.user.role === ROLES.INSTRUCTOR) {
                return next();
            }

            // Get resource owner's user ID
            const resourceUserId = await getResourceUserId(authReq);

            // Check if current user is the owner
            if (resourceUserId !== authReq.user.id) {
                return next(ApiError.forbidden('Access denied. You can only access your own resources'));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
