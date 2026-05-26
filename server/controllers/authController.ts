import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { clearSessionCookie, getSessionUser, setSessionCookie, signSession } from '../middleware/authMiddleware.ts';
import { createClientUser, findUserByEmail, toPublicUser } from '../models/userModel.ts';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const userRecord = await findUserByEmail(email);
  if (!userRecord) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isValid = await bcrypt.compare(password, userRecord.password);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const user = toPublicUser(userRecord);
  setSessionCookie(res, signSession(user));
  res.json({ user });
};

export const logout = (_req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ ok: true });
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, company } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    company?: string;
  };

  if (!name || !email || !password || password.length < 8) {
    res.status(400).json({ error: 'Name, email, and a password of at least 8 characters are required.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await createClientUser({ name, email, password: hashedPassword, phone, company });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }

  setSessionCookie(res, signSession(user));
  res.status(201).json({ user });
};

export const session = (req: Request, res: Response) => {
  res.json({ user: getSessionUser(req) });
};
