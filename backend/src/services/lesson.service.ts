/**
 * Lesson Service
 * Business logic layer for lesson management
 * NEVER accesses Prisma directly - uses Repository layer
 */

import { Lesson } from '@prisma/client';
import * as lessonRepository from '../repositories/lesson.repository';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import {
    CreateLessonBody,
    UpdateLessonBody,
    ReorderLessonsBody,
} from '../validators/lesson.validator';

/**
 * Verify module ownership by instructor
 * Throws ForbiddenError if instructor doesn't own the module's course
 */
const verifyModuleOwnership = async (
    moduleId: number,
    instructorId: number
): Promise<void> => {
    const module = await lessonRepository.getModuleWithOwner(moduleId);

    if (!module) {
        throw ApiError.notFound('Module not found');
    }

    if (module.course.instructorId !== instructorId) {
        throw ApiError.forbidden('You do not have permission to modify this module');
    }
};

/**
 * Verify lesson ownership through the ownership chain
 * Lesson -> Module -> Course -> Instructor
 * Throws ForbiddenError if instructor doesn't own the lesson's course
 */
const verifyLessonOwnership = async (
    lessonId: number,
    instructorId: number
): Promise<Lesson> => {
    const lesson = await lessonRepository.findByIdWithOwnership(lessonId);

    if (!lesson) {
        throw ApiError.notFound('Lesson not found');
    }

    if (lesson.module.course.instructorId !== instructorId) {
        throw ApiError.forbidden('You do not have permission to modify this lesson');
    }

    return lesson;
};

/**
 * Create a new lesson
 * Validates module ownership and auto-sets position
 */
export const createLesson = async (
    data: CreateLessonBody,
    instructorId: number
): Promise<Lesson> => {
    // Verify the module belongs to a course owned by this instructor
    await verifyModuleOwnership(data.moduleId, instructorId);

    // Get current lesson count to determine position (at the end)
    const lessonCount = await lessonRepository.countByModuleId(data.moduleId);

    const lesson = await lessonRepository.create({
        title: data.title,
        type: data.type,
        description: data.description,
        position: lessonCount, // Add at the end
        module: {
            connect: { id: data.moduleId },
        },
    });

    logger.info(
        `Lesson created: ${lesson.title} (ID: ${lesson.id}) in module ${data.moduleId}`
    );

    return lesson;
};

/**
 * Update a lesson
 * SECURITY: Verifies ownership chain before update
 */
export const updateLesson = async (
    id: number,
    data: UpdateLessonBody,
    instructorId: number
): Promise<Lesson> => {
    // Verify ownership chain - throws if not owner
    await verifyLessonOwnership(id, instructorId);

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.duration !== undefined) updateData.duration = data.duration;

    const lesson = await lessonRepository.update(id, updateData);

    logger.info(`Lesson updated: ${lesson.title} (ID: ${lesson.id})`);

    return lesson;
};

/**
 * Delete a lesson
 * SECURITY: Verifies ownership chain before delete
 */
export const deleteLesson = async (
    id: number,
    instructorId: number
): Promise<void> => {
    // Verify ownership chain - throws if not owner
    await verifyLessonOwnership(id, instructorId);

    await lessonRepository.deleteLesson(id);

    logger.info(`Lesson deleted: ID ${id} by instructor ${instructorId}`);
};

/**
 * Get a lesson by ID
 */
export const getLessonById = async (id: number): Promise<Lesson> => {
    const lesson = await lessonRepository.findById(id);

    if (!lesson) {
        throw ApiError.notFound('Lesson not found');
    }

    return lesson;
};

/**
 * Reorder lessons within a module
 * SECURITY: Verifies module ownership and that all lessons belong to the module
 */
export const reorderLessons = async (
    data: ReorderLessonsBody,
    instructorId: number
): Promise<void> => {
    // Verify module ownership
    await verifyModuleOwnership(data.moduleId, instructorId);

    // Verify all lesson IDs belong to this module
    const lessonIds = data.lessons.map((l) => l.id);
    const allBelongToModule = await lessonRepository.verifyLessonsBelongToModule(
        data.moduleId,
        lessonIds
    );

    if (!allBelongToModule) {
        throw ApiError.badRequest(
            'One or more lessons do not belong to the specified module'
        );
    }

    // Perform reorder in transaction
    await lessonRepository.reorderLessons(data.moduleId, data.lessons);

    logger.info(
        `Lessons reordered in module ${data.moduleId}: ${lessonIds.length} lessons`
    );
};
