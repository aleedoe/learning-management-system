/**
 * Lesson Routes
 * Lesson management endpoints (Instructor only)
 */

import { Router } from 'express';
import * as lessonController from '../controllers/lesson.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createLessonSchema,
    updateLessonSchema,
    lessonIdSchema,
    reorderLessonsSchema,
} from '../validators/lesson.validator';

const router = Router();

// Apply authentication and instructor authorization to ALL routes
router.use(authenticate);
router.use(authorize('INSTRUCTOR'));

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
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
 *               - moduleId
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               moduleId:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [VIDEO, TEXT, QUIZ]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Module not found
 *       422:
 *         description: Validation error
 */
router.post('/', validate(createLessonSchema), lessonController.create);

/**
 * @swagger
 * /lessons/reorder:
 *   put:
 *     summary: Reorder lessons within a module
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - lessons
 *             properties:
 *               moduleId:
 *                 type: integer
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     position:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Lessons reordered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       400:
 *         description: Lessons do not belong to the module
 */
router.put('/reorder', validate(reorderLessonsSchema), lessonController.reorder);

/**
 * @swagger
 * /lessons/{id}:
 *   patch:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *                 description: Markdown content for TEXT lessons
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *               isPublished:
 *                 type: boolean
 *               isFree:
 *                 type: boolean
 *               duration:
 *                 type: integer
 *                 description: Duration in seconds
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Lesson not found
 *       422:
 *         description: Validation error
 */
router.patch('/:id', validate(updateLessonSchema), lessonController.update);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lesson ID
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the course owner
 *       404:
 *         description: Lesson not found
 */
router.delete('/:id', validate(lessonIdSchema), lessonController.deleteLesson);

export default router;
