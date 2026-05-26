import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createProject, dashboardPath, getClients, getSession } from '../lib/api.ts';
import type { AuthUser, ProjectPayload } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ProjectForm } from '../components/dashboard/ProjectForm.tsx';

export const AdminProjectNew = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clients, setClients] = useState<AuthUser[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        const { clients } = await getClients();
        setClients(clients);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load clients.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <DashboardShell title="Create project" subtitle="Add one client project with clean scope, dates, status, and financials." user={user}>
      <div className="mb-6">
        <a href="/admin/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow-hover">
          <ArrowLeft size={16} />
          Back to dashboard
        </a>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white p-8 text-center neo-border neo-shadow">
          <p className="text-xs font-black uppercase tracking-widest text-brand-primary">No clients yet</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-normal">Create a client before adding a project.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-brand-ink/65">
            Projects need a client owner so each client only sees their own work.
          </p>
          <a href="/admin/clients/new" className="mt-6 inline-flex bg-brand-sand px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow-hover">
            Create client account
          </a>
        </div>
      ) : (
        <div className="max-w-4xl">
          {error && <p className="mb-5 bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}
          <ProjectForm
            clients={clients}
            submitLabel="Create project"
            onSubmit={async (payload: ProjectPayload) => {
              const { project } = await createProject(payload);
              window.location.assign(`/admin/projects/${project.id}`);
            }}
          />
        </div>
      )}
    </DashboardShell>
  );
};

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading form...</p>
  </main>
);
