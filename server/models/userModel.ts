import { getSupabase } from '../db/supabase.js';
import type { AuthUser, UserRole } from '../types.js';

export interface UserRow extends AuthUser {
  password: string;
}

const userColumns = 'id, name, email, password, phone, role, company';
const clientColumns = 'id, name, email, phone, role, company';

const publicUser = (user: UserRow): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  company: user.company,
});

export const findUserByEmail = async (email: string) => {
  const { data, error } = await getSupabase()
    .from('users')
    .select(userColumns)
    .eq('email', email.trim().toLowerCase())
    .single<UserRow>();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data;
};

export const findUserById = async (id: string) => {
  const { data, error } = await getSupabase().from('users').select(userColumns).eq('id', id).single<UserRow>();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return publicUser(data);
};

export const listClients = async () => {
  const { data, error } = await getSupabase().from('users').select(clientColumns).eq('role', 'client').order('name', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as AuthUser[];
};

export const createClientUser = async (input: { name: string; email: string; password: string; phone?: string; company?: string }) => {
  const { data, error } = await getSupabase()
    .from('users')
    .insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      phone: input.phone?.trim() || null,
      role: 'client',
      company: input.company?.trim() || null,
    })
    .select(clientColumns)
    .single<AuthUser>();

  if (error) {
    if (error.code === '23505') throw new Error('An account with this email already exists.');
    throw new Error(error.message);
  }

  return data;
};

export const toPublicUser = publicUser;

export const isRole = (value: string): value is UserRole => value === 'admin' || value === 'client';
