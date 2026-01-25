/**
 * Course Routes
 * Course management endpoints (Instructor only)
 */

import { Router } from 'express';
import * as courseController from '../controllers/course.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createCourseSchema,
    updateCourseSchema,
    courseIdSchema,
    addModuleSchema,
} from '../validators/course.validator';

const router = Router();

// Apply authentication and instructor authorization to ALL routes
router.use(authenticate);
router.use(authorize('INSTRUCTOR'));

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *               enrollmentKey:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor role required
 *       422:
 *         description: Validation error
 */
router.post('/', validate(createCourseSchema), courseController.create);

/**
 * @swagger
 * /courses/me/all:
 *   get:
 *     summary: Get all courses for current instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor role required
 */
router.get('/me/all', courseController.getMyCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get('/:id', validate(courseIdSchema), courseController.getOne);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *               enrollmentKey:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Course not found
 *       422:
 *         description: Validation error
 */
router.patch('/:id', validate(updateCourseSchema), courseController.update);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Course not found
 */
router.delete('/:id', validate(courseIdSchema), courseController.deleteCourse);

/**
 * @swagger
 * /courses/{id}/modules:
 *   post:
 *     summary: Add a module to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Module added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Course not found
 *       422:
 *         description: Validation error
 */
router.post('/:id/modules', validate(addModuleSchema), courseController.addModule);

export default router;
