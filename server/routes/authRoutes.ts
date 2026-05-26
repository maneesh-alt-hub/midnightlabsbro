import { Router } from 'express';
import { login, logout, session, signup } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/signup', asyncHandler(signup));
authRoutes.post('/logout', logout);
authRoutes.get('/session', session);
