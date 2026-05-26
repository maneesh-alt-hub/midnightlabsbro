import type { AuthUser, Project, ProjectPayload } from '../types/dashboard.ts';

const request = async <T>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? 'Request failed.');

  return data;
};

export const login = (email: string, password: string) =>
  request<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const signup = (payload: { name: string; email: string; password: string; phone?: string; company?: string }) =>
  request<{ user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logout = () =>
  request<{ ok: true }>('/api/auth/logout', {
    method: 'POST',
  });

export const getSession = () => request<{ user: AuthUser | null }>('/api/auth/session');

export const getClients = () => request<{ clients: AuthUser[] }>('/api/users/clients');

export const createClient = (payload: { name: string; email: string; password: string; phone?: string; company?: string }) =>
  request<{ client: AuthUser }>('/api/users/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getProjects = (status?: string) => {
  const params = status ? `?status=${encodeURIComponent(status)}` : '';
  return request<{ projects: Project[] }>(`/api/projects${params}`);
};

export const getProject = (id: string) => request<{ project: Project }>(`/api/projects/${id}`);

export const createProject = (payload: ProjectPayload) =>
  request<{ project: Project }>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateProject = (id: string, payload: ProjectPayload) =>
  request<{ project: Project }>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const dashboardPath = (role: AuthUser['role']) => (role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
