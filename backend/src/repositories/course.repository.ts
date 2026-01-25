/**
 * Course Repository
 * Data access layer for course management - ONLY layer with Prisma access
 */

import { Course, Module, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Course with nested modules and lessons
 */
export type CourseWithModules = Prisma.CourseGetPayload<{
    include: {
        modules: {
            include: {
                lessons: true;
            };
        };
        category: true;
        instructor: {
            select: {
                id: true;
                firstName: true;
                lastName: true;
                avatar: true;
            };
        };
    };
}>;

/**
 * Create a new course
 */
export const create = async (data: Prisma.CourseCreateInput): Promise<Course> => {
    return prisma.course.create({
        data,
    });
};

/**
 * Update a course by ID
 */
export const update = async (
    id: number,
    data: Prisma.CourseUpdateInput
): Promise<Course> => {
    return prisma.course.update({
        where: { id },
        data,
    });
};

/**
 * Find a course by ID with nested modules and lessons
 * Modules ordered by position ASC, lessons ordered by position ASC
 */
export const findById = async (id: number): Promise<CourseWithModules | null> => {
    return prisma.course.findUnique({
        where: { id },
        include: {
            modules: {
                orderBy: { position: 'asc' },
                include: {
                    lessons: {
                        orderBy: { position: 'asc' },
                    },
                },
            },
            category: true,
            instructor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                },
            },
        },
    });
};

/**
 * Find a course by slug
 */
export const findBySlug = async (slug: string): Promise<Course | null> => {
    return prisma.course.findUnique({
        where: { slug },
    });
};

/**
 * Find all courses by instructor ID
 */
export const findByInstructor = async (instructorId: number): Promise<Course[]> => {
    return prisma.course.findMany({
        where: { instructorId },
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
            _count: {
                select: {
                    modules: true,
                    enrollments: true,
                },
            },
        },
    });
};

/**
 * Add a module to a course
 * Auto-calculates position based on existing modules count
 */
export const addModule = async (
    courseId: number,
    data: { title: string; description?: string }
): Promise<Module> => {
    // Get current module count to determine position
    const moduleCount = await prisma.module.count({
        where: { courseId },
    });

    return prisma.module.create({
        data: {
            courseId,
            title: data.title,
            description: data.description,
            position: moduleCount,
        },
    });
};

/**
 * Delete a course by ID
 */
export const deleteCourse = async (id: number): Promise<Course> => {
    return prisma.course.delete({
        where: { id },
    });
};

/**
 * Check if a course exists
 */
export const exists = async (id: number): Promise<boolean> => {
    const course = await prisma.course.findUnique({
        where: { id },
        select: { id: true },
    });
    return course !== null;
};
