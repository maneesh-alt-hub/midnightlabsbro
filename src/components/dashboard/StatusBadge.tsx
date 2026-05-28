import * as React from 'react';
import type { ProjectStatus } from '../../types/dashboard.ts';
import { statusLabels } from '../../lib/format.ts';

const badgeClasses: Record<ProjectStatus, string> = {
  not_started: 'bg-neutral-200 text-brand-ink',
  in_progress: 'bg-brand-sand text-brand-ink',
  completed: 'bg-emerald-300 text-brand-ink',
};

export const StatusBadge = ({ status }: { status: ProjectStatus }) => (
  <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 text-[10px] font-black uppercase tracking-widest neo-border ${badgeClasses[status]}`}>
    {statusLabels[status]}
  </span>
);
