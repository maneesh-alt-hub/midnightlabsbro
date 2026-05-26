import bcrypt from 'bcrypt';
import type { AuthUser, Project, ProjectStatus } from '../types.js';
import type { ProjectInput } from '../models/projectModel.js';

interface DevUser extends AuthUser {
  password: string;
}

const password = bcrypt.hashSync('midnight-admin', 12);

const users: DevUser[] = [
  {
    id: 'dev-admin-1',
    name: 'Maneesh Admin',
    email: 'maneeshkhandavalliwork@gmail.com',
    password,
    phone: '+91 90000 00001',
    role: 'admin',
    company: 'Midnight Labs',
  },
  {
    id: 'dev-admin-2',
    name: 'Midnight Admin',
    email: 'admin@midnightlabs.dev',
    password,
    phone: '+91 90000 00002',
    role: 'admin',
    company: 'Midnight Labs',
  },
];

let projects: Project[] = [];

const enrichProject = (project: Omit<Project, 'client_name' | 'client_email' | 'client_phone' | 'client_company'>): Project => {
  const client = users.find((user) => user.id === project.client_id);
  return {
    ...project,
    client_name: client?.name ?? 'Unknown client',
    client_email: client?.email ?? '',
    client_phone: client?.phone ?? null,
    client_company: client?.company ?? null,
  };
};

export const devStore = {
  findUserByEmail(email: string) {
    return users.find((user) => user.email === email.trim().toLowerCase()) ?? null;
  },

  findUserById(id: string) {
    const user = users.find((user) => user.id === id);
    if (!user) return null;
    const { password: _password, ...publicUser } = user;
    return publicUser;
  },

  createClient(input: { name: string; email: string; password: string; phone?: string; company?: string }) {
    const normalizedEmail = input.email.trim().toLowerCase();
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const user: DevUser = {
      id: `dev-client-${Date.now()}`,
      name: input.name.trim(),
      email: normalizedEmail,
      password: input.password,
      phone: input.phone?.trim() || null,
      role: 'client',
      company: input.company?.trim() || null,
    };

    users.push(user);
    const { password: _password, ...publicUser } = user;
    return publicUser;
  },

  listClients() {
    return users.filter((user) => user.role === 'client').map(({ password: _password, ...user }) => user);
  },

  listProjects(status?: ProjectStatus, clientId?: string) {
    return projects.filter((project) => (!status || project.status === status) && (!clientId || project.client_id === clientId));
  },

  findProjectById(id: string) {
    return projects.find((project) => project.id === id) ?? null;
  },

  createProject(input: ProjectInput) {
    const project = enrichProject({
      id: `dev-project-${Date.now()}`,
      client_id: input.client_id,
      name: input.name,
      description: input.description,
      status: input.status,
      start_date: input.start_date,
      deadline: input.deadline,
      total_price: String(input.total_price),
      amount_paid: String(input.amount_paid),
      notes: input.notes ?? '',
      completed_work: input.completed_work ?? '',
      created_at: new Date().toISOString(),
    });

    projects = [project, ...projects];
    return project;
  },

  updateProject(id: string, input: ProjectInput) {
    const existing = projects.find((project) => project.id === id);
    if (!existing) return null;

    const updated = enrichProject({
      ...existing,
      client_id: input.client_id,
      name: input.name,
      description: input.description,
      status: input.status,
      start_date: input.start_date,
      deadline: input.deadline,
      total_price: String(input.total_price),
      amount_paid: String(input.amount_paid),
      notes: input.notes ?? '',
      completed_work: input.completed_work ?? '',
    });

    projects = projects.map((project) => (project.id === id ? updated : project));
    return updated;
  },
};
