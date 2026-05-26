import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { dashboardPath, getProjects, getSession } from '../lib/api.ts';
import { formatDate } from '../lib/format.ts';
import type { AuthUser, Project } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ProjectCard } from '../components/dashboard/ProjectCard.tsx';

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
    <DashboardShell title="Client dashboard" subtitle="A clean view of your active Midnight Labs projects and progress." user={user}>
      {error && <p className="mb-5 bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}
      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="bg-white p-5 neo-border neo-shadow">
          <p className="text-xs font-black uppercase tracking-widest text-brand-ink/55">Your projects</p>
          <p className="mt-2 text-4xl font-black">{projects.length}</p>
        </div>
        <div className="bg-brand-sand p-5 neo-border neo-shadow">
          <p className="text-xs font-black uppercase tracking-widest text-brand-ink/55">Next deadline</p>
          <p className="mt-2 text-2xl font-black uppercase tracking-normal">{nextDeadline ? formatDate(nextDeadline) : 'No projects'}</p>
        </div>
      </section>
      {projects.length === 0 ? (
        <section className="bg-white p-8 text-center neo-border neo-shadow">
          <p className="text-xs font-black uppercase tracking-widest text-brand-primary">No projects yet</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-normal">Your workspace is ready.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-brand-ink/65">
            Once Midnight Labs adds a project to your account, it will appear here with timeline, progress, and pricing.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} href={`/client/projects/${project.id}`} />
          ))}
        </section>
      )}
    </DashboardShell>
  );
};

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading portal...</p>
  </main>
);
