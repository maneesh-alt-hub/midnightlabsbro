import { Router } from 'express';
import { getClients, postClient } from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const userRoutes = Router();

userRoutes.get('/clients', requireAuth('admin'), asyncHandler(getClients));
userRoutes.post('/clients', requireAuth('admin'), asyncHandler(postClient));
