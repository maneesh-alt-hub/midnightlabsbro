import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { dashboardPath, getProjects, getSession } from '../lib/api.ts';
import type { AuthUser, Project, ProjectStatus } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ProjectCard } from '../components/dashboard/ProjectCard.tsx';

const filters: Array<{ label: string; value: ProjectStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Not Started', value: 'not_started' },
];

export const AdminDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = async (nextFilter = filter) => {
    const { projects } = await getProjects(nextFilter || undefined);
    setProjects(projects);
  };

  useEffect(() => {
    getSession()
      .then(async ({ user }) => {
        if (!user) {
          window.location.replace('/login');
          return;
        }
        if (user.role !== 'admin') {
          window.location.replace(dashboardPath(user.role));
          return;
        }
        setUser(user);
        const { projects } = await getProjects();
        setProjects(projects);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load dashboard.'))
      .finally(() => setIsLoading(false));
  }, []);

  const summary = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((project) => project.status === 'in_progress').length,
      completed: projects.filter((project) => project.status === 'completed').length,
      notStarted: projects.filter((project) => project.status === 'not_started').length,
    }),
    [projects],
  );

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <DashboardShell title="Admin dashboard" subtitle="A focused workspace for clients, projects, status, and financials." user={user}>
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Projects" value={summary.total} />
          <Stat label="In progress" value={summary.active} />
          <Stat label="Completed" value={summary.completed} />
          <Stat label="Not started" value={summary.notStarted} />
        </div>

        <div className="flex flex-col gap-4 bg-white p-5 neo-border neo-shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={async () => {
                  setFilter(item.value);
                  await loadProjects(item.value);
                }}
                className={`px-4 py-3 text-xs font-black uppercase tracking-widest neo-border ${
                  filter === item.value ? 'bg-brand-ink text-white' : 'bg-brand-cream text-brand-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/clients/new"
              className="inline-flex items-center justify-center gap-2 bg-brand-sand px-4 py-3 text-xs font-black uppercase tracking-widest text-brand-ink neo-border neo-shadow-hover"
            >
              <UserPlus size={16} />
              New client
            </a>
            <a
              href="/admin/projects/new"
              className="inline-flex items-center justify-center gap-2 bg-brand-primary px-4 py-3 text-xs font-black uppercase tracking-widest text-white neo-border neo-shadow-hover"
            >
              <Plus size={16} />
              New project
            </a>
          </div>
        </div>

        {error && <p className="bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}

        {projects.length === 0 ? (
          <div className="bg-white p-8 text-center neo-border neo-shadow">
            <p className="text-xs font-black uppercase tracking-widest text-brand-primary">No projects yet</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-normal">Start with a client account.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-brand-ink/65">
              Create a client account first, then add a project from the project form. New projects will appear here in a clean list.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/admin/clients/new" className="bg-brand-sand px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow-hover">
                Create client
              </a>
              <a href="/admin/projects/new" className="bg-brand-primary px-5 py-4 text-sm font-black uppercase tracking-widest text-white neo-border neo-shadow-hover">
                Create project
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} href={`/admin/projects/${project.id}`} showClient />
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-5 neo-border neo-shadow">
    <p className="text-xs font-black uppercase tracking-widest text-brand-ink/55">{label}</p>
    <p className="mt-3 text-4xl font-black leading-none">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading dashboard...</p>
  </main>
);
