import { Router } from 'express';
import { getProject, getProjects, postProject, putProject } from '../controllers/projectController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const projectRoutes = Router();

projectRoutes.get('/', requireAuth(), asyncHandler(getProjects));
projectRoutes.get('/:id', requireAuth(), asyncHandler(getProject));
projectRoutes.post('/', requireAuth('admin'), asyncHandler(postProject));
projectRoutes.put('/:id', requireAuth('admin'), asyncHandler(putProject));
