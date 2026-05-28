import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FolderPlus, UserPlus } from 'lucide-react';
import { createClient, createProject, dashboardPath, getClients, getProjects, getSession } from '../lib/api.ts';
import { formatDate, formatMoney } from '../lib/format.ts';
import type { AuthUser, Project, ProjectPayload, ProjectStatus } from '../types/dashboard.ts';
import { ClientForm } from '../components/dashboard/ClientForm.tsx';
import { DashboardModal } from '../components/dashboard/DashboardModal.tsx';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ProjectForm } from '../components/dashboard/ProjectForm.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';

const filters: Array<{ label: string; value: ProjectStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Not Started', value: 'not_started' },
];

export const AdminDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clients, setClients] = useState<AuthUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | ''>('');
  const [modal, setModal] = useState<'client' | 'project' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async (nextFilter = filter) => {
    const [projectResponse, clientResponse] = await Promise.all([getProjects(nextFilter || undefined), getClients()]);
    setProjects(projectResponse.projects);
    setClients(clientResponse.clients);
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
        await loadDashboard('');
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
    <DashboardShell title="Admin Dashboard" subtitle="Manage clients, projects, status, deadlines, and financials." user={user}>
      <section className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total Projects" value={summary.total} />
          <Stat label="In Progress" value={summary.active} />
          <Stat label="Completed" value={summary.completed} />
          <Stat label="Not Started" value={summary.notStarted} />
        </div>

        <div className="flex flex-col gap-3 bg-white p-3 neo-border neo-shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={async () => {
                  setFilter(item.value);
                  await loadDashboard(item.value);
                }}
                className={`px-3 py-2 text-[11px] font-black uppercase tracking-widest neo-border ${
                  filter === item.value ? 'bg-brand-ink text-white' : 'bg-brand-cream text-brand-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModal('client')}
              className="inline-flex items-center gap-2 bg-brand-sand px-3 py-2 text-[11px] font-black uppercase tracking-widest text-brand-ink neo-border neo-shadow-hover"
            >
              <UserPlus size={15} />
              New Client
            </button>
            <button
              type="button"
              onClick={() => setModal('project')}
              className="inline-flex items-center gap-2 bg-brand-primary px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white neo-border neo-shadow-hover"
            >
              <FolderPlus size={15} />
              New Project
            </button>
          </div>
        </div>

        {error && <p className="bg-brand-primary px-3 py-2 text-xs font-bold text-white neo-border">{error}</p>}

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <ProjectTable projects={projects} />
          <ClientList clients={clients} />
        </div>
      </section>

      {modal === 'client' && (
        <DashboardModal title="New Client" onClose={() => setModal(null)}>
          <ClientForm
            submitLabel="Create Client"
            onSubmit={async (payload) => {
              await createClient(payload);
              await loadDashboard();
              setModal(null);
            }}
          />
        </DashboardModal>
      )}

      {modal === 'project' && (
        <DashboardModal title="New Project" onClose={() => setModal(null)}>
          {clients.length === 0 ? (
            <p className="bg-brand-cream p-3 text-sm font-bold neo-border">
              Add a client before creating a project. Use the New Client button first.
            </p>
          ) : (
            <ProjectForm
              clients={clients}
              submitLabel="Create Project"
              onSubmit={async (payload: ProjectPayload) => {
                await createProject(payload);
                await loadDashboard();
                setModal(null);
              }}
            />
          )}
        </DashboardModal>
      )}
    </DashboardShell>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-3 neo-border neo-shadow">
    <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/55">{label}</p>
    <p className="mt-1 text-2xl font-black leading-none">{value}</p>
  </div>
);

const ProjectTable = ({ projects }: { projects: Project[] }) => (
  <section className="overflow-hidden bg-white neo-border neo-shadow">
    <header className="flex items-center justify-between border-b-2 border-brand-ink px-3 py-2">
      <h2 className="text-sm font-black uppercase tracking-normal">Projects</h2>
      <span className="text-[10px] font-black uppercase tracking-widest text-brand-ink/50">{projects.length} total</span>
    </header>
    {projects.length === 0 ? (
      <p className="p-3 text-sm font-bold text-brand-ink/65">No projects yet. Create a client, then add their first project.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-brand-cream">
            <tr className="border-b-2 border-brand-ink text-[10px] font-black uppercase tracking-widest text-brand-ink/55">
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Deadline</th>
              <th className="px-3 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => window.location.assign(`/admin/projects/${project.id}`)}
                className="cursor-pointer border-b border-brand-ink/20 text-sm font-bold hover:bg-brand-sand/45"
              >
                <td className="px-3 py-2 font-black uppercase">{project.name}</td>
                <td className="px-3 py-2 text-brand-ink/70">{project.client_name}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-3 py-2">{formatDate(project.deadline)}</td>
                <td className="px-3 py-2 text-right">{formatMoney(project.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

const ClientList = ({ clients }: { clients: AuthUser[] }) => (
  <aside className="bg-white neo-border neo-shadow">
    <header className="flex items-center justify-between border-b-2 border-brand-ink px-3 py-2">
      <h2 className="text-sm font-black uppercase tracking-normal">Clients</h2>
      <span className="text-[10px] font-black uppercase tracking-widest text-brand-ink/50">{clients.length} total</span>
    </header>
    {clients.length === 0 ? (
      <p className="p-3 text-sm font-bold text-brand-ink/65">No client accounts yet.</p>
    ) : (
      <div className="divide-y divide-brand-ink/20">
        {clients.map((client) => (
          <div key={client.id} className="px-3 py-2">
            <p className="text-sm font-black uppercase tracking-normal">{client.name}</p>
            <p className="truncate text-xs font-bold text-brand-ink/65">{client.email}</p>
            <p className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-widest text-brand-primary">{client.company || 'No company'}</p>
          </div>
        ))}
      </div>
    )}
  </aside>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow">Loading dashboard...</p>
  </main>
);
