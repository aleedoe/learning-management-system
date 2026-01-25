/**
 * Lesson Controller
 * HTTP request/response handlers for lesson management
 * Uses asyncHandler to eliminate try-catch boilerplate
 */

import { Response } from 'express';
import * as lessonService from '../services/lesson.service';
import { success, created, noContent } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import {
    CreateLessonBody,
    UpdateLessonBody,
    LessonIdParams,
    ReorderLessonsBody,
} from '../validators/lesson.validator';
import { asyncAuthHandler } from '../utils/asyncHandler';

/**
 * Create a new lesson
 * POST /lessons
 */
export const create = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as CreateLessonBody;
    const instructorId = parseInt(req.user!.id, 10);

    const lesson = await lessonService.createLesson(body, instructorId);

    created(res, lesson, 'Lesson created successfully');
});

/**
 * Update a lesson
 * PATCH /lessons/:id
 */
export const update = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as unknown as LessonIdParams;
    const body = req.body as UpdateLessonBody;
    const instructorId = parseInt(req.user!.id, 10);

    const lesson = await lessonService.updateLesson(id, body, instructorId);

    success(res, lesson, 'Lesson updated successfully');
});

/**
 * Delete a lesson
 * DELETE /lessons/:id
 */
export const deleteLesson = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as unknown as LessonIdParams;
    const instructorId = parseInt(req.user!.id, 10);

    await lessonService.deleteLesson(id, instructorId);

    noContent(res);
});

/**
 * Reorder lessons within a module
 * PUT /lessons/reorder
 */
export const reorder = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as ReorderLessonsBody;
    const instructorId = parseInt(req.user!.id, 10);

    await lessonService.reorderLessons(body, instructorId);

    success(res, null, 'Lessons reordered successfully');
});
