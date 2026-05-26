import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createClientUser, listClients } from '../models/userModel.js';

export const getClients = async (_req: Request, res: Response) => {
  const clients = await listClients();
  res.json({ clients });
};

export const postClient = async (req: Request, res: Response) => {
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
  try {
    const client = await createClientUser({ name, email, password: hashedPassword, phone, company });
    res.status(201).json({ client });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
};
