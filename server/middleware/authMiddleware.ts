import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { env, isProduction } from '../config/env.ts';
import type { AuthUser, JwtPayload, UserRole } from '../types.ts';

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

const cookieName = 'ml_session';
const sessionDays = 7;

const readCookie = (req: Request, name: string) => {
  const header = req.headers.cookie;
  if (!header) return undefined;

  const cookie = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
};

export const signSession = (user: AuthUser) =>
  jwt.sign(user, env.jwtSecret, {
    expiresIn: `${sessionDays}d`,
  });

export const setSessionCookie = (res: Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * sessionDays,
  });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  });
};

export const getSessionUser = (req: Request) => {
  const token = readCookie(req, cookieName);
  if (!token) return null;

  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
};

export const requireAuth = (role?: UserRole) => (req: AuthedRequest, res: Response, next: NextFunction) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  if (role && user.role !== role) {
    res.status(403).json({ error: 'You do not have access to this resource.' });
    return;
  }

  req.user = user;
  next();
};
