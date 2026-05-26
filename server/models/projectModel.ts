import { query } from '../db/pool.ts';
import { isDatabaseUnavailable } from '../db/dbErrors.ts';
import { devStore } from '../db/devStore.ts';
import type { Project, ProjectStatus } from '../types.ts';

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

const projectSelect = `
  SELECT
    p.id,
    p.client_id,
    p.name,
    p.description,
    p.status,
    p.start_date::text,
    p.deadline::text,
    p.total_price::text,
    p.amount_paid::text,
    p.notes,
    p.completed_work,
    p.created_at::text,
    u.name AS client_name,
    u.email AS client_email,
    u.phone AS client_phone,
    u.company AS client_company
  FROM projects p
  JOIN users u ON u.id = p.client_id
`;

export const listProjects = async (status?: ProjectStatus, clientId?: string) => {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    params.push(status);
    conditions.push(`p.status = $${params.length}`);
  }

  if (clientId) {
    params.push(clientId);
    conditions.push(`p.client_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  try {
    const result = await query<Project>(`${projectSelect} ${where} ORDER BY p.deadline ASC`, params);
    return result.rows;
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.listProjects(status, clientId);
    throw error;
  }
};

export const findProjectById = async (id: string) => {
  try {
    const result = await query<Project>(`${projectSelect} WHERE p.id = $1`, [id]);
    return result.rows[0] ?? null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.findProjectById(id);
    throw error;
  }
};

export const createProject = async (input: ProjectInput) => {
  try {
    const result = await query<Project>(
      `
        INSERT INTO projects
          (client_id, name, description, status, start_date, deadline, total_price, amount_paid, notes, completed_work)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
      [
        input.client_id,
        input.name,
        input.description,
        input.status,
        input.start_date,
        input.deadline,
        input.total_price,
        input.amount_paid,
        input.notes ?? '',
        input.completed_work ?? '',
      ],
    );

    return findProjectById(result.rows[0].id);
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.createProject(input);
    throw error;
  }
};

export const updateProject = async (id: string, input: ProjectInput) => {
  try {
    await query(
      `
        UPDATE projects
        SET client_id = $1,
            name = $2,
            description = $3,
            status = $4,
            start_date = $5,
            deadline = $6,
            total_price = $7,
            amount_paid = $8,
            notes = $9,
            completed_work = $10
        WHERE id = $11
      `,
      [
        input.client_id,
        input.name,
        input.description,
        input.status,
        input.start_date,
        input.deadline,
        input.total_price,
        input.amount_paid,
        input.notes ?? '',
        input.completed_work ?? '',
        id,
      ],
    );

    return findProjectById(id);
  } catch (error) {
    if (isDatabaseUnavailable(error)) return devStore.updateProject(id, input);
    throw error;
  }
};

export const isStatus = (value: string): value is ProjectStatus =>
  value === 'not_started' || value === 'in_progress' || value === 'completed';
