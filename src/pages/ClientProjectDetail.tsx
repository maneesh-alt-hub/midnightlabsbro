import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { dashboardPath, getProject, getSession } from '../lib/api.ts';
import { formatDate, formatMoney, progressForStatus } from '../lib/format.ts';
import type { AuthUser, Project } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';

export const ClientProjectDetail = ({ id }: { id: string }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(async ({ user }) => {
        if (!user) {
          window.location.replace('/login');
          return;
        }
        if (user.role !== 'client') {
          window.location.replace(dashboardPath(user.role));
          return;
        }
        setUser(user);
        const { project } = await getProject(id);
        setProject(project);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load project.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !user) return <LoadingScreen />;

  if (!project) {
    return (
      <DashboardShell title="Project not found" subtitle={error || 'This project could not be loaded.'} user={user}>
        <a href="/client/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border">
          <ArrowLeft size={16} />
          Back
        </a>
      </DashboardShell>
    );
  }

  const amountDue = Number(project.total_price) - Number(project.amount_paid);
  const progress = progressForStatus[project.status];

  return (
    <DashboardShell title={project.name} subtitle="Your project scope, timeline, progress, and price summary." user={user}>
      <div className="mb-6">
        <a href="/client/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow-hover">
          <ArrowLeft size={16} />
          Back to projects
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <article className="bg-white p-5 neo-border neo-shadow">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-2xl font-black uppercase tracking-normal">Project overview</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm font-semibold leading-7 text-brand-ink/75">{project.description}</p>
          </article>

          <article className="bg-white p-5 neo-border neo-shadow">
            <h2 className="text-xl font-black uppercase tracking-normal">Timeline</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Start date" value={formatDate(project.start_date)} />
              <Info label="Deadline" value={formatDate(project.deadline)} />
            </div>
          </article>

          <article className="bg-white p-5 neo-border neo-shadow">
            <h2 className="text-xl font-black uppercase tracking-normal">What's completed</h2>
            <div className="mt-4 flex gap-3">
              <CheckCircle2 size={22} className="mt-1 shrink-0 text-emerald-700" />
              <p className="text-sm font-semibold leading-7 text-brand-ink/75">
                {project.completed_work || 'Your project updates will appear here as the team completes milestones.'}
              </p>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="bg-brand-sand p-5 neo-border neo-shadow">
            <p className="text-xs font-black uppercase tracking-widest text-brand-ink/60">Progress</p>
            <p className="mt-3 text-5xl font-black">{progress}%</p>
            <div className="mt-5 h-4 overflow-hidden bg-brand-cream neo-border">
              <div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} />
            </div>
          </article>

          <article className="bg-white p-5 neo-border neo-shadow">
            <h2 className="text-xl font-black uppercase tracking-normal">Price summary</h2>
            <div className="mt-5 space-y-4">
              <Info label="Total price" value={formatMoney(project.total_price)} />
              <Info label="Amount paid" value={formatMoney(project.amount_paid)} />
              <Info label="Amount due" value={formatMoney(amountDue)} />
            </div>
          </article>
        </aside>
      </div>
    </DashboardShell>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-black uppercase tracking-widest text-brand-ink/50">{label}</p>
    <p className="mt-1 break-words text-sm font-bold leading-6">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading project...</p>
  </main>
);
