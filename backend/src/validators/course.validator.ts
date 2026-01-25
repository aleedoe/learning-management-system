/**
 * Course Validators
 * Zod schemas for course management request validation
 */

import { z } from 'zod';
import { CourseLevel } from '@prisma/client';
import { ValidationSchema } from '../types';

/**
 * Create course body schema
 */
const createCourseBodySchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters')
        .trim(),
    categoryId: z
        .number({
            required_error: 'Category ID is required',
            invalid_type_error: 'Category ID must be a number',
        })
        .int('Category ID must be an integer')
        .positive('Category ID must be positive'),
    description: z
        .string()
        .max(5000, 'Description must not exceed 5000 characters')
        .trim()
        .optional(),
    level: z
        .nativeEnum(CourseLevel, {
            errorMap: () => ({
                message: 'Level must be BEGINNER, INTERMEDIATE, ADVANCED, or ALL_LEVELS',
            }),
        })
        .optional(),
    enrollmentKey: z
        .string()
        .min(4, 'Enrollment key must be at least 4 characters')
        .max(50, 'Enrollment key must not exceed 50 characters')
        .optional(),
    thumbnail: z
        .string()
        .url('Thumbnail must be a valid URL')
        .optional(),
});

/**
 * Update course body schema (all fields optional)
 */
const updateCourseBodySchema = createCourseBodySchema.partial();

/**
 * Course ID parameter schema
 */
const courseIdParamsSchema = z.object({
    id: z.coerce
        .number({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a number',
        })
        .int('Course ID must be an integer')
        .positive('Course ID must be positive'),
});

/**
 * Module body schema
 */
const moduleBodySchema = z.object({
    title: z
        .string({
            required_error: 'Module title is required',
        })
        .min(1, 'Module title is required')
        .max(200, 'Module title must not exceed 200 characters')
        .trim(),
    description: z
        .string()
        .max(1000, 'Module description must not exceed 1000 characters')
        .trim()
        .optional(),
});

/**
 * Create course request validation schema
 */
export const createCourseSchema: ValidationSchema = {
    body: createCourseBodySchema,
};

/**
 * Update course request validation schema
 */
export const updateCourseSchema: ValidationSchema = {
    body: updateCourseBodySchema,
    params: courseIdParamsSchema,
};

/**
 * Get/Delete course request validation schema
 */
export const courseIdSchema: ValidationSchema = {
    params: courseIdParamsSchema,
};

/**
 * Add module request validation schema
 */
export const addModuleSchema: ValidationSchema = {
    body: moduleBodySchema,
    params: courseIdParamsSchema,
};

/**
 * Inferred types from schemas
 */
export type CreateCourseBody = z.infer<typeof createCourseBodySchema>;
export type UpdateCourseBody = z.infer<typeof updateCourseBodySchema>;
export type CourseIdParams = z.infer<typeof courseIdParamsSchema>;
export type ModuleBody = z.infer<typeof moduleBodySchema>;
