import { Router } from 'express';
import { getClients, postClient } from '../controllers/userController.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

export const userRoutes = Router();

userRoutes.get('/clients', requireAuth('admin'), asyncHandler(getClients));
userRoutes.post('/clients', requireAuth('admin'), asyncHandler(postClient));
