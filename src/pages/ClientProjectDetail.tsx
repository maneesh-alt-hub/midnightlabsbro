import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { dashboardPath, getProject, getSession } from '../lib/api.ts';
import { formatDate, formatMoney, progressForStatus, statusLabels } from '../lib/format.ts';
import type { AuthUser, Project, ProjectStatus } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';

const steps: ProjectStatus[] = ['not_started', 'in_progress', 'completed'];

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
      <DashboardShell title="Project Not Found" subtitle={error || 'This project could not be loaded.'} user={user}>
        <BackLink />
      </DashboardShell>
    );
  }

  const amountDue = Number(project.total_price) - Number(project.amount_paid);
  const progress = progressForStatus[project.status];

  return (
    <DashboardShell title={project.name} subtitle="Project timeline, status, and price summary." user={user}>
      <div className="mb-4">
        <BackLink />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <article className="bg-white p-4 neo-border neo-shadow">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-normal">Project Info</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm font-semibold leading-6 text-brand-ink/75">{project.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Start Date" value={formatDate(project.start_date)} />
              <Info label="Deadline" value={formatDate(project.deadline)} />
            </div>
          </article>

          <article className="bg-white p-4 neo-border neo-shadow">
            <h2 className="text-sm font-black uppercase tracking-normal">Progress Timeline</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {steps.map((step) => {
                const complete = progressForStatus[project.status] >= progressForStatus[step];
                return (
                  <div key={step} className={`${complete ? 'bg-brand-sand' : 'bg-brand-cream'} p-3 neo-border`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/55">Step</p>
                    <p className="mt-1 text-sm font-black uppercase">{statusLabels[step]}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="bg-white p-4 neo-border neo-shadow">
            <h2 className="text-sm font-black uppercase tracking-normal">Completed Work</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-brand-ink/75">
              {project.completed_work || 'Progress updates will appear here as milestones are completed.'}
            </p>
          </article>
        </section>

        <aside className="space-y-4">
          <article className="bg-brand-sand p-4 neo-border neo-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/60">Progress</p>
            <p className="mt-1 text-3xl font-black leading-none">{progress}%</p>
            <div className="mt-3 h-3 overflow-hidden bg-brand-cream neo-border">
              <div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} />
            </div>
          </article>

          <article className="bg-white p-4 neo-border neo-shadow">
            <h2 className="text-sm font-black uppercase tracking-normal">Price Summary</h2>
            <div className="mt-3 space-y-3">
              <Info label="Total" value={formatMoney(project.total_price)} />
              <Info label="Paid" value={formatMoney(project.amount_paid)} />
              <Info label="Remaining" value={formatMoney(amountDue)} />
            </div>
          </article>
        </aside>
      </div>
    </DashboardShell>
  );
};

const BackLink = () => (
  <a href="/client/dashboard" className="inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest neo-border neo-shadow-hover">
    <ArrowLeft size={15} />
    Back to dashboard
  </a>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/50">{label}</p>
    <p className="mt-1 break-words text-sm font-bold leading-5">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow">Loading project...</p>
  </main>
);
