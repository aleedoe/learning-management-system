/**
 * Course Service
 * Business logic layer for course management
 * NEVER accesses Prisma directly - uses Repository layer
 */

import { Course, Module } from '@prisma/client';
import * as courseRepository from '../repositories/course.repository';
import { CourseWithModules } from '../repositories/course.repository';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import {
    CreateCourseBody,
    UpdateCourseBody,
    ModuleBody,
} from '../validators/course.validator';

/**
 * Generate a URL-friendly slug from title
 * Appends a random string for uniqueness
 */
const generateSlug = (title: string): string => {
    const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .substring(0, 50); // Limit length

    // Generate random suffix for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    return `${baseSlug}-${randomSuffix}`;
};

/**
 * Ensure slug is unique by checking database
 */
const ensureUniqueSlug = async (title: string): Promise<string> => {
    let slug = generateSlug(title);
    let exists = await courseRepository.findBySlug(slug);

    // Keep generating until we find a unique slug
    while (exists) {
        slug = generateSlug(title);
        exists = await courseRepository.findBySlug(slug);
    }

    return slug;
};

/**
 * Verify course ownership
 * Throws ForbiddenError if user doesn't own the course
 */
const verifyOwnership = async (
    courseId: number,
    instructorId: number
): Promise<CourseWithModules> => {
    const course = await courseRepository.findById(courseId);

    if (!course) {
        throw ApiError.notFound('Course not found');
    }

    if (course.instructorId !== instructorId) {
        throw ApiError.forbidden('You do not have permission to modify this course');
    }

    return course;
};

/**
 * Create a new course
 */
export const createCourse = async (
    data: CreateCourseBody,
    instructorId: number
): Promise<Course> => {
    // Generate unique slug from title
    const slug = await ensureUniqueSlug(data.title);

    const course = await courseRepository.create({
        title: data.title,
        slug,
        description: data.description,
        level: data.level,
        enrollmentKey: data.enrollmentKey,
        thumbnail: data.thumbnail,
        instructor: {
            connect: { id: instructorId },
        },
        category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
    });

    logger.info(`Course created: ${course.title} (ID: ${course.id}) by instructor ${instructorId}`);

    return course;
};

/**
 * Update a course
 * SECURITY: Verifies ownership before update
 */
export const updateCourse = async (
    id: number,
    data: UpdateCourseBody,
    instructorId: number
): Promise<Course> => {
    // Verify ownership - throws if not owner
    await verifyOwnership(id, instructorId);

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.enrollmentKey !== undefined) updateData.enrollmentKey = data.enrollmentKey;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.categoryId !== undefined) {
        updateData.category = { connect: { id: data.categoryId } };
    }

    const course = await courseRepository.update(id, updateData);

    logger.info(`Course updated: ${course.title} (ID: ${course.id})`);

    return course;
};

/**
 * Get course by ID
 */
export const getCourseById = async (id: number): Promise<CourseWithModules> => {
    const course = await courseRepository.findById(id);

    if (!course) {
        throw ApiError.notFound('Course not found');
    }

    return course;
};

/**
 * Get all courses for an instructor
 */
export const getMyCourses = async (instructorId: number): Promise<Course[]> => {
    return courseRepository.findByInstructor(instructorId);
};

/**
 * Delete a course
 * SECURITY: Verifies ownership before delete
 */
export const deleteCourse = async (
    id: number,
    instructorId: number
): Promise<void> => {
    // Verify ownership - throws if not owner
    await verifyOwnership(id, instructorId);

    await courseRepository.deleteCourse(id);

    logger.info(`Course deleted: ID ${id} by instructor ${instructorId}`);
};

/**
 * Add a module to a course
 * SECURITY: Verifies ownership before adding module
 */
export const addModule = async (
    courseId: number,
    data: ModuleBody,
    instructorId: number
): Promise<Module> => {
    // Verify ownership - throws if not owner
    await verifyOwnership(courseId, instructorId);

    const module = await courseRepository.addModule(courseId, {
        title: data.title,
        description: data.description,
    });

    logger.info(`Module added: ${module.title} to course ${courseId}`);

    return module;
};
