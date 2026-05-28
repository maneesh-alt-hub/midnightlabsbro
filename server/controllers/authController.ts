import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { clearSessionCookie, getSessionUser, setSessionCookie, signSession } from '../middleware/authMiddleware.js';
import { createClientUser, findUserByEmail, toPublicUser, updateUserPassword } from '../models/userModel.js';

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  let userRecord;
  try {
    userRecord = await findUserByEmail(normalizedEmail);
  } catch (error) {
    console.log('[auth:login] user lookup failed', {
      email: normalizedEmail,
      error,
    });
    throw error;
  }

  if (!userRecord) {
    console.log('[auth:login] user not found', { email: normalizedEmail });
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const passwordLooksHashed = isBcryptHash(userRecord.password);

  if (!passwordLooksHashed) {
    console.log('[auth:login] stored password is not a bcrypt hash', {
      email: normalizedEmail,
      userId: userRecord.id,
      storedPasswordLength: userRecord.password.length,
      storedPasswordPrefix: userRecord.password.slice(0, 4),
    });
  }

  let isValid = false;
  try {
    isValid = passwordLooksHashed ? await bcrypt.compare(password, userRecord.password) : password === userRecord.password;
  } catch (error) {
    console.log('[auth:login] bcrypt.compare failed', {
      email: normalizedEmail,
      userId: userRecord.id,
      error,
    });
  }

  if (!isValid) {
    console.log('[auth:login] password comparison failed', {
      email: normalizedEmail,
      userId: userRecord.id,
      passwordLooksHashed,
    });
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (!passwordLooksHashed) {
    try {
      await updateUserPassword(userRecord.id, await bcrypt.hash(password, 12));
      console.log('[auth:login] upgraded legacy plaintext password to bcrypt hash', {
        email: normalizedEmail,
        userId: userRecord.id,
      });
    } catch (error) {
      console.log('[auth:login] legacy password upgrade failed', {
        email: normalizedEmail,
        userId: userRecord.id,
        error,
      });
      throw error;
    }
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
