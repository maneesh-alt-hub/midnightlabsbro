import { Router } from 'express';
import { getProject, getProjects, postProject, putProject } from '../controllers/projectController.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

export const projectRoutes = Router();

projectRoutes.get('/', requireAuth(), asyncHandler(getProjects));
projectRoutes.get('/:id', requireAuth(), asyncHandler(getProject));
projectRoutes.post('/', requireAuth('admin'), asyncHandler(postProject));
projectRoutes.put('/:id', requireAuth('admin'), asyncHandler(putProject));
