/**
 * Async Handler Wrapper
 * Higher-Order Function to eliminate try-catch boilerplate in controllers
 * Automatically catches errors and passes them to Express error middleware
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types';

/**
 * Type for async controller functions
 */
type AsyncFunction<T extends Request = Request> = (
    req: T,
    res: Response,
    next: NextFunction
) => Promise<void>;

/**
 * Wraps an async controller function to automatically catch errors
 * and forward them to the Express error handling middleware
 *
 * @example
 * // Without asyncHandler (repetitive try-catch):
 * export const getUser = async (req, res, next) => {
 *   try {
 *     const user = await userService.getById(req.params.id);
 *     res.json(user);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 *
 * // With asyncHandler (clean and concise):
 * export const getUser = asyncHandler(async (req, res) => {
 *   const user = await userService.getById(req.params.id);
 *   res.json(user);
 * });
 *
 * @param fn - Async controller function to wrap
 * @returns Express RequestHandler that catches errors automatically
 */
export const asyncHandler = <T extends Request = Request>(
    fn: AsyncFunction<T>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req as T, res, next)).catch(next);
    };
};

/**
 * Type-safe wrapper specifically for authenticated routes
 * Ensures req.user is available
 *
 * @example
 * export const getProfile = asyncAuthHandler(async (req, res) => {
 *   // req.user is typed and available
 *   const user = await userService.getById(req.user!.id);
 *   res.json(user);
 * });
 */
export const asyncAuthHandler = (
    fn: AsyncFunction<AuthenticatedRequest>
): RequestHandler => {
    return asyncHandler<AuthenticatedRequest>(fn);
};

export default asyncHandler;
