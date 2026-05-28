import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { dashboardPath, getProjects, getSession } from '../lib/api.ts';
import { formatDate, progressForStatus } from '../lib/format.ts';
import type { AuthUser, Project } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';

export const ClientDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
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
        const { projects } = await getProjects();
        setProjects(projects);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load portal.'))
      .finally(() => setIsLoading(false));
  }, []);

  const nextDeadline = useMemo(() => projects[0]?.deadline ?? null, [projects]);

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <DashboardShell title="Client Dashboard" subtitle="Track project status, deadlines, progress, and price summaries." user={user}>
      <section className="space-y-4">
        {error && <p className="bg-brand-primary px-3 py-2 text-xs font-bold text-white neo-border">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Your Projects" value={projects.length} />
          <div className="bg-brand-sand p-3 neo-border neo-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/55">Next Deadline</p>
            <p className="mt-1 inline-flex items-center gap-2 text-base font-black uppercase tracking-normal">
              <CalendarDays size={16} />
              {nextDeadline ? formatDate(nextDeadline) : 'No projects'}
            </p>
          </div>
        </div>

        <section className="bg-white neo-border neo-shadow">
          <header className="flex items-center justify-between border-b-2 border-brand-ink px-3 py-2">
            <h2 className="text-sm font-black uppercase tracking-normal">Projects</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-ink/50">{projects.length} total</span>
          </header>

          {projects.length === 0 ? (
            <p className="p-3 text-sm font-bold text-brand-ink/65">No projects are assigned to your account yet.</p>
          ) : (
            <div className="divide-y divide-brand-ink/20">
              {projects.map((project) => (
                <a key={project.id} href={`/client/projects/${project.id}`} className="grid gap-3 px-3 py-3 hover:bg-brand-sand/45 md:grid-cols-[1.4fr_150px_130px_180px] md:items-center">
                  <div>
                    <p className="text-sm font-black uppercase tracking-normal">{project.name}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-brand-ink/65">{project.description}</p>
                  </div>
                  <StatusBadge status={project.status} />
                  <p className="text-xs font-black uppercase tracking-widest">{formatDate(project.deadline)}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden bg-brand-cream neo-border">
                      <div className="h-full bg-brand-primary" style={{ width: `${progressForStatus[project.status]}%` }} />
                    </div>
                    <span className="w-9 text-right text-xs font-black">{progressForStatus[project.status]}%</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </section>
    </DashboardShell>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-3 neo-border neo-shadow">
    <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/55">{label}</p>
    <p className="mt-1 text-2xl font-black leading-none">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow">Loading portal...</p>
  </main>
);
