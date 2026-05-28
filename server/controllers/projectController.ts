import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/authMiddleware.js';
import { createProject, deleteProject, findProjectById, isStatus, listProjects, updateProject, type ProjectInput } from '../models/projectModel.js';

const parseProjectInput = (body: Record<string, unknown>): ProjectInput | null => {
  const status = String(body.status ?? '');
  if (!isStatus(status)) return null;

  const required = ['client_id', 'name', 'description', 'start_date', 'deadline'] as const;
  if (required.some((field) => !body[field])) return null;

  return {
    client_id: String(body.client_id),
    name: String(body.name),
    description: String(body.description),
    status,
    start_date: String(body.start_date),
    deadline: String(body.deadline),
    total_price: Number(body.total_price ?? 0),
    amount_paid: Number(body.amount_paid ?? 0),
    notes: String(body.notes ?? ''),
    completed_work: String(body.completed_work ?? ''),
  };
};

export const getProjects = async (req: AuthedRequest, res: Response) => {
  const status = typeof req.query.status === 'string' && isStatus(req.query.status) ? req.query.status : undefined;
  const clientId = req.user?.role === 'client' ? req.user.id : undefined;
  const projects = await listProjects(status, clientId);

  res.json({ projects });
};

export const getProject = async (req: AuthedRequest, res: Response) => {
  const project = await findProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  if (req.user?.role === 'client' && project.client_id !== req.user.id) {
    res.status(403).json({ error: 'You do not have access to this project.' });
    return;
  }

  res.json({ project });
};

export const postProject = async (req: AuthedRequest, res: Response) => {
  const input = parseProjectInput(req.body as Record<string, unknown>);
  if (!input) {
    res.status(400).json({ error: 'Project data is incomplete or invalid.' });
    return;
  }

  const project = await createProject(input);
  res.status(201).json({ project });
};

export const putProject = async (req: AuthedRequest, res: Response) => {
  const input = parseProjectInput(req.body as Record<string, unknown>);
  if (!input) {
    res.status(400).json({ error: 'Project data is incomplete or invalid.' });
    return;
  }

  const project = await updateProject(req.params.id, input);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  res.json({ project });
};

export const removeProject = async (req: AuthedRequest, res: Response) => {
  const project = await findProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  await deleteProject(req.params.id);
  res.json({ ok: true });
};
