import * as React from 'react';
import { CalendarDays, Wallet } from 'lucide-react';
import { formatDate, formatMoney, progressForStatus } from '../../lib/format.ts';
import type { Project } from '../../types/dashboard.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  href: string;
  showClient?: boolean;
}

export const ProjectCard = ({ project, href, showClient = false }: ProjectCardProps) => (
  <a href={href} className="block bg-white p-5 neo-border neo-shadow-hover">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-black uppercase tracking-normal">{project.name}</h2>
        {showClient && <p className="mt-1 text-sm font-bold text-brand-ink/60">{project.client_name}</p>}
      </div>
      <StatusBadge status={project.status} />
    </div>
    <div className="mt-6 grid gap-3 text-sm font-bold text-brand-ink/75 sm:grid-cols-2">
      <span className="inline-flex items-center gap-2">
        <CalendarDays size={18} />
        {formatDate(project.deadline)}
      </span>
      <span className="inline-flex items-center gap-2">
        <Wallet size={18} />
        {formatMoney(project.total_price)}
      </span>
    </div>
    <div className="mt-5 h-3 overflow-hidden bg-brand-cream neo-border">
      <div className="h-full bg-brand-primary" style={{ width: `${progressForStatus[project.status]}%` }} />
    </div>
  </a>
);
