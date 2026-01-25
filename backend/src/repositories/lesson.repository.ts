/**
 * Lesson Repository
 * Data access layer for lesson management - ONLY layer with Prisma access
 */

import { Lesson, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Lesson with module and course info for ownership verification
 */
export type LessonWithOwnership = Prisma.LessonGetPayload<{
    include: {
        module: {
            include: {
                course: {
                    select: {
                        id: true;
                        instructorId: true;
                    };
                };
            };
        };
    };
}>;

/**
 * Create a new lesson
 */
export const create = async (data: Prisma.LessonCreateInput): Promise<Lesson> => {
    return prisma.lesson.create({
        data,
    });
};

/**
 * Update a lesson by ID
 */
export const update = async (
    id: number,
    data: Prisma.LessonUpdateInput
): Promise<Lesson> => {
    return prisma.lesson.update({
        where: { id },
        data,
    });
};

/**
 * Delete a lesson by ID
 */
export const deleteLesson = async (id: number): Promise<Lesson> => {
    return prisma.lesson.delete({
        where: { id },
    });
};

/**
 * Find a lesson by ID
 */
export const findById = async (id: number): Promise<Lesson | null> => {
    return prisma.lesson.findUnique({
        where: { id },
    });
};

/**
 * Find a lesson by ID with ownership chain (Module -> Course -> Instructor)
 */
export const findByIdWithOwnership = async (
    id: number
): Promise<LessonWithOwnership | null> => {
    return prisma.lesson.findUnique({
        where: { id },
        include: {
            module: {
                include: {
                    course: {
                        select: {
                            id: true,
                            instructorId: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * Get the count of lessons in a module (for auto-positioning)
 */
export const countByModuleId = async (moduleId: number): Promise<number> => {
    return prisma.lesson.count({
        where: { moduleId },
    });
};

/**
 * Reorder lessons within a module using a transaction
 */
export const reorderLessons = async (
    _moduleId: number,
    lessonsOrder: { id: number; position: number }[]
): Promise<void> => {
    // Use a transaction to update all positions atomically
    await prisma.$transaction(
        lessonsOrder.map(({ id, position }) =>
            prisma.lesson.update({
                where: { id },
                data: { position },
            })
        )
    );
};

/**
 * Get module with course owner info
 */
export const getModuleWithOwner = async (
    moduleId: number
): Promise<{
    id: number;
    courseId: number;
    course: { instructorId: number };
} | null> => {
    return prisma.module.findUnique({
        where: { id: moduleId },
        select: {
            id: true,
            courseId: true,
            course: {
                select: {
                    instructorId: true,
                },
            },
        },
    });
};

/**
 * Check if all lesson IDs belong to the specified module
 */
export const verifyLessonsBelongToModule = async (
    moduleId: number,
    lessonIds: number[]
): Promise<boolean> => {
    const count = await prisma.lesson.count({
        where: {
            id: { in: lessonIds },
            moduleId,
        },
    });
    return count === lessonIds.length;
};
