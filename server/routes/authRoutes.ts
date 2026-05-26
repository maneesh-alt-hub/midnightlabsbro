import { Router } from 'express';
import { login, logout, session, signup } from '../controllers/authController.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/signup', asyncHandler(signup));
authRoutes.post('/logout', logout);
authRoutes.get('/session', session);
