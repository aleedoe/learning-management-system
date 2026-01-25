/**
 * Course Controller
 * HTTP request/response handlers for course management
 * Uses asyncHandler to eliminate try-catch boilerplate
 * Returns clean DTOs, never raw DB objects
 */

import { Response } from 'express';
import * as courseService from '../services/course.service';
import { success, created, noContent } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import {
    CreateCourseBody,
    UpdateCourseBody,
    CourseIdParams,
    ModuleBody,
} from '../validators/course.validator';
import { asyncAuthHandler } from '../utils/asyncHandler';

/**
 * Create a new course
 * POST /courses
 */
export const create = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as CreateCourseBody;
    const instructorId = parseInt(req.user!.id, 10);

    const course = await courseService.createCourse(body, instructorId);

    created(res, course, 'Course created successfully');
});

/**
 * Update a course
 * PATCH /courses/:id
 */
export const update = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as unknown as CourseIdParams;
    const body = req.body as UpdateCourseBody;
    const instructorId = parseInt(req.user!.id, 10);

    const course = await courseService.updateCourse(id, body, instructorId);

    success(res, course, 'Course updated successfully');
});

/**
 * Get a single course
 * GET /courses/:id
 */
export const getOne = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as unknown as CourseIdParams;

    const course = await courseService.getCourseById(id);

    success(res, course, 'Course retrieved successfully');
});

/**
 * Get all courses for current instructor
 * GET /courses/me/all
 */
export const getMyCourses = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const instructorId = parseInt(req.user!.id, 10);

    const courses = await courseService.getMyCourses(instructorId);

    success(res, courses, 'Courses retrieved successfully');
});

/**
 * Delete a course
 * DELETE /courses/:id
 */
export const deleteCourse = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as unknown as CourseIdParams;
    const instructorId = parseInt(req.user!.id, 10);

    await courseService.deleteCourse(id, instructorId);

    noContent(res);
});

/**
 * Add a module to a course
 * POST /courses/:id/modules
 */
export const addModule = asyncAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id: courseId } = req.params as unknown as CourseIdParams;
    const body = req.body as ModuleBody;
    const instructorId = parseInt(req.user!.id, 10);

    const module = await courseService.addModule(courseId, body, instructorId);

    created(res, module, 'Module added successfully');
});
