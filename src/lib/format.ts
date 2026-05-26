import type { ProjectStatus } from '../types/dashboard.ts';

export const statusLabels: Record<ProjectStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const progressForStatus: Record<ProjectStatus, number> = {
  not_started: 10,
  in_progress: 58,
  completed: 100,
};

export const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
