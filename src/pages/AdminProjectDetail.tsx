import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { dashboardPath, getClients, getProject, getSession, updateProject } from '../lib/api.ts';
import { formatDate, formatMoney } from '../lib/format.ts';
import type { AuthUser, Project, ProjectPayload } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';
import { ProjectForm } from '../components/dashboard/ProjectForm.tsx';

export const AdminProjectDetail = ({ id }: { id: string }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clients, setClients] = useState<AuthUser[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProject = async () => {
    const { project } = await getProject(id);
    setProject(project);
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
        const [projectResponse, clientResponse] = await Promise.all([getProject(id), getClients()]);
        setProject(projectResponse.project);
        setClients(clientResponse.clients);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load project.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !user) return <LoadingScreen />;

  if (!project) {
    return (
      <DashboardShell title="Project not found" subtitle={error || 'This project could not be loaded.'} user={user}>
        <a href="/admin/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border">
          <ArrowLeft size={16} />
          Back
        </a>
      </DashboardShell>
    );
  }

  const amountDue = Number(project.total_price) - Number(project.amount_paid);

  return (
    <DashboardShell title={project.name} subtitle="Client details, project scope, financials, and internal admin notes." user={user}>
      <div className="mb-6">
        <a href="/admin/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow-hover">
          <ArrowLeft size={16} />
          Back to projects
        </a>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <InfoBlock title="Client info">
            <Info label="Name" value={project.client_name} />
            <Info label="Email" value={project.client_email} />
            <Info label="Phone" value={project.client_phone ?? 'Not added'} />
            <Info label="Company" value={project.client_company ?? 'Not added'} />
          </InfoBlock>

          <InfoBlock title="Project info">
            <div className="mb-4">
              <StatusBadge status={project.status} />
            </div>
            <Info label="Description" value={project.description} wide />
            <Info label="Start date" value={formatDate(project.start_date)} />
            <Info label="Deadline" value={formatDate(project.deadline)} />
          </InfoBlock>

          <InfoBlock title="Financials">
            <Info label="Total price" value={formatMoney(project.total_price)} />
            <Info label="Amount paid" value={formatMoney(project.amount_paid)} />
            <Info label="Amount due" value={formatMoney(amountDue)} />
          </InfoBlock>

          <InfoBlock title="Internal notes">
            <p className="text-sm font-semibold leading-6 text-brand-ink/75">{project.notes || 'No internal notes yet.'}</p>
          </InfoBlock>
        </section>

        <ProjectForm
          clients={clients}
          project={project}
          submitLabel="Save changes"
          onSubmit={async (payload: ProjectPayload) => {
            await updateProject(project.id, payload);
            await loadProject();
          }}
        />
      </div>
    </DashboardShell>
  );
};

const InfoBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="bg-white p-5 neo-border neo-shadow">
    <h2 className="mb-5 text-xl font-black uppercase tracking-normal">{title}</h2>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </article>
);

const Info = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => (
  <div className={wide ? 'sm:col-span-2' : ''}>
    <p className="text-xs font-black uppercase tracking-widest text-brand-ink/50">{label}</p>
    <p className="mt-1 break-words text-sm font-bold leading-6">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading project...</p>
  </main>
);
