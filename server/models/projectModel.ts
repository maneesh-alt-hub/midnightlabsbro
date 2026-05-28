import { getSupabase } from '../db/supabase.js';
import type { Project, ProjectStatus } from '../types.js';

export interface ProjectInput {
  client_id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  start_date: string;
  deadline: string;
  total_price: number;
  amount_paid: number;
  notes?: string;
  completed_work?: string;
}

type SupabaseProject = Omit<Project, 'client_name' | 'client_email' | 'client_phone' | 'client_company'> & {
  users:
    | {
        name: string;
        email: string;
        phone: string | null;
        company: string | null;
      }
    | Array<{
        name: string;
        email: string;
        phone: string | null;
        company: string | null;
      }>;
};

const projectColumns = `
  id,
  client_id,
  name,
  description,
  status,
  start_date,
  deadline,
  total_price,
  amount_paid,
  notes,
  completed_work,
  created_at,
  users:client_id (
    name,
    email,
    phone,
    company
  )
`;

const normalizeProject = (project: SupabaseProject): Project => {
  const client = Array.isArray(project.users) ? project.users[0] : project.users;

  return {
    id: project.id,
    client_id: project.client_id,
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.start_date,
    deadline: project.deadline,
    total_price: String(project.total_price),
    amount_paid: String(project.amount_paid),
    notes: project.notes,
    completed_work: project.completed_work,
    created_at: project.created_at,
    client_name: client?.name ?? 'Unknown client',
    client_email: client?.email ?? '',
    client_phone: client?.phone ?? null,
    client_company: client?.company ?? null,
  };
};

const projectPayload = (input: ProjectInput) => ({
  client_id: input.client_id,
  name: input.name,
  description: input.description,
  status: input.status,
  start_date: input.start_date,
  deadline: input.deadline,
  total_price: input.total_price,
  amount_paid: input.amount_paid,
  notes: input.notes ?? '',
  completed_work: input.completed_work ?? '',
});

export const listProjects = async (status?: ProjectStatus, clientId?: string) => {
  let request = getSupabase().from('projects').select(projectColumns).order('deadline', { ascending: true });

  if (status) request = request.eq('status', status);
  if (clientId) request = request.eq('client_id', clientId);

  const { data, error } = await request.returns<SupabaseProject[]>();

  if (error) throw new Error(error.message);

  return (data ?? []).map(normalizeProject);
};

export const findProjectById = async (id: string) => {
  const { data, error } = await getSupabase().from('projects').select(projectColumns).eq('id', id).single<SupabaseProject>();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return normalizeProject(data);
};

export const createProject = async (input: ProjectInput) => {
  const { data, error } = await getSupabase().from('projects').insert(projectPayload(input)).select(projectColumns).single<SupabaseProject>();

  if (error) throw new Error(error.message);

  return normalizeProject(data);
};

export const updateProject = async (id: string, input: ProjectInput) => {
  const { data, error } = await getSupabase()
    .from('projects')
    .update(projectPayload(input))
    .eq('id', id)
    .select(projectColumns)
    .single<SupabaseProject>();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return normalizeProject(data);
};

export const deleteProject = async (id: string) => {
  const { error } = await getSupabase().from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const isStatus = (value: string): value is ProjectStatus =>
  value === 'not_started' || value === 'in_progress' || value === 'completed';
