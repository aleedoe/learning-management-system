/**
 * Lesson Validators
 * Zod schemas for lesson management request validation
 */

import { z } from 'zod';
import { LessonType } from '@prisma/client';
import { ValidationSchema } from '../types';

/**
 * Create lesson body schema
 */
const createLessonBodySchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .min(1, 'Title is required')
        .max(200, 'Title must not exceed 200 characters')
        .trim(),
    moduleId: z
        .number({
            required_error: 'Module ID is required',
            invalid_type_error: 'Module ID must be a number',
        })
        .int('Module ID must be an integer')
        .positive('Module ID must be positive'),
    type: z.nativeEnum(LessonType, {
        errorMap: () => ({
            message: 'Type must be VIDEO, TEXT, or QUIZ',
        }),
    }),
    description: z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional(),
});

/**
 * Update lesson body schema
 */
const updateLessonBodySchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must not exceed 200 characters')
        .trim()
        .optional(),
    content: z
        .string()
        .max(50000, 'Content must not exceed 50000 characters')
        .optional(),
    videoUrl: z
        .string()
        .url('Video URL must be a valid URL')
        .optional()
        .nullable(),
    description: z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional(),
    isPublished: z.boolean().optional(),
    isFree: z.boolean().optional(),
    duration: z
        .number()
        .int('Duration must be an integer')
        .min(0, 'Duration cannot be negative')
        .optional(),
});

/**
 * Lesson ID parameter schema
 */
const lessonIdParamsSchema = z.object({
    id: z.coerce
        .number()
        .int('Lesson ID must be an integer')
        .positive('Lesson ID must be positive'),
});

/**
 * Reorder lessons body schema
 */
const reorderLessonsBodySchema = z.object({
    moduleId: z
        .number({
            required_error: 'Module ID is required',
            invalid_type_error: 'Module ID must be a number',
        })
        .int('Module ID must be an integer')
        .positive('Module ID must be positive'),
    lessons: z
        .array(
            z.object({
                id: z
                    .number({
                        required_error: 'Lesson ID is required',
                    })
                    .int('Lesson ID must be an integer')
                    .positive('Lesson ID must be positive'),
                position: z
                    .number({
                        required_error: 'Position is required',
                    })
                    .int('Position must be an integer')
                    .min(0, 'Position cannot be negative'),
            })
        )
        .min(1, 'At least one lesson is required'),
});

/**
 * Create lesson request validation schema
 */
export const createLessonSchema: ValidationSchema = {
    body: createLessonBodySchema,
};

/**
 * Update lesson request validation schema
 */
export const updateLessonSchema: ValidationSchema = {
    body: updateLessonBodySchema,
    params: lessonIdParamsSchema,
};

/**
 * Get/Delete lesson request validation schema
 */
export const lessonIdSchema: ValidationSchema = {
    params: lessonIdParamsSchema,
};

/**
 * Reorder lessons request validation schema
 */
export const reorderLessonsSchema: ValidationSchema = {
    body: reorderLessonsBodySchema,
};

/**
 * Inferred types from schemas
 */
export type CreateLessonBody = z.infer<typeof createLessonBodySchema>;
export type UpdateLessonBody = z.infer<typeof updateLessonBodySchema>;
export type LessonIdParams = z.infer<typeof lessonIdParamsSchema>;
export type ReorderLessonsBody = z.infer<typeof reorderLessonsBodySchema>;
