import { query } from '../db/pool.js';
import { isDatabaseUnavailable } from '../db/dbErrors.js';
import { devStore } from '../db/devStore.js';
import type { AuthUser, UserRole } from '../types.js';

interface UserRow extends AuthUser {
  password: string;
}

const publicUser = (user: UserRow): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  company: user.company,
});

export const findUserByEmail = async (email: string) => {
  try {
    const result = await query<UserRow>(
      'SELECT id, name, email, password, phone, role, company FROM users WHERE email = $1',
      [email.trim().toLowerCase()],
    );

    return result.rows[0] ?? null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.findUserByEmail(email);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    const result = await query<UserRow>('SELECT id, name, email, password, phone, role, company FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    return user ? publicUser(user) : null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.findUserById(id);
    throw error;
  }
};

export const listClients = async () => {
  try {
    const result = await query<AuthUser>(
      "SELECT id, name, email, phone, role, company FROM users WHERE role = 'client' ORDER BY name ASC",
    );
    return result.rows;
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.listClients();
    throw error;
  }
};

export const createClientUser = async (input: { name: string; email: string; password: string; phone?: string; company?: string }) => {
  try {
    const result = await query<AuthUser>(
      `
        INSERT INTO users (name, email, password, phone, role, company)
        VALUES ($1, $2, $3, $4, 'client', $5)
        RETURNING id, name, email, phone, role, company
      `,
      [input.name.trim(), input.email.trim().toLowerCase(), input.password, input.phone?.trim() || null, input.company?.trim() || null],
    );

    return result.rows[0];
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.createClient(input);
    const dbError = error as { code?: string };
    if (dbError.code === '23505') throw new Error('An account with this email already exists.');
    throw error;
  }
};

export const toPublicUser = publicUser;

export const isRole = (value: string): value is UserRole => value === 'admin' || value === 'client';
