import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { dashboardPath, getClients, getProject, getSession, updateProject } from '../lib/api.ts';
import { formatDate, formatMoney } from '../lib/format.ts';
import type { AuthUser, Project, ProjectPayload } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ProjectForm } from '../components/dashboard/ProjectForm.tsx';
import { StatusBadge } from '../components/dashboard/StatusBadge.tsx';

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
      <DashboardShell title="Project Not Found" subtitle={error || 'This project could not be loaded.'} user={user}>
        <BackLink />
      </DashboardShell>
    );
  }

  const amountDue = Number(project.total_price) - Number(project.amount_paid);

  return (
    <DashboardShell title={project.name} subtitle="Edit project status, financials, progress updates, and internal notes." user={user}>
      <div className="mb-4">
        <BackLink />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          <InfoBlock title="Client Info">
            <Info label="Name" value={project.client_name} />
            <Info label="Email" value={project.client_email} />
            <Info label="Phone" value={project.client_phone ?? 'Not added'} />
            <Info label="Company" value={project.client_company ?? 'Not added'} />
          </InfoBlock>

          <InfoBlock title="Project Info">
            <div className="sm:col-span-2">
              <StatusBadge status={project.status} />
            </div>
            <Info label="Description" value={project.description} wide />
            <Info label="Start Date" value={formatDate(project.start_date)} />
            <Info label="Deadline" value={formatDate(project.deadline)} />
          </InfoBlock>

          <InfoBlock title="Financials">
            <Info label="Total Price" value={formatMoney(project.total_price)} />
            <Info label="Amount Paid" value={formatMoney(project.amount_paid)} />
            <Info label="Amount Due" value={formatMoney(amountDue)} />
          </InfoBlock>

          <InfoBlock title="Progress / Notes">
            <Info label="Progress Updates" value={project.completed_work || 'No progress updates yet.'} wide />
            <Info label="Internal Notes" value={project.notes || 'No internal notes yet.'} wide />
          </InfoBlock>
        </section>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <ProjectForm
            clients={clients}
            project={project}
            submitLabel="Save Changes"
            onSubmit={async (payload: ProjectPayload) => {
              await updateProject(project.id, payload);
              await loadProject();
            }}
          />
        </aside>
      </div>
    </DashboardShell>
  );
};

const BackLink = () => (
  <a href="/admin/dashboard" className="inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest neo-border neo-shadow-hover">
    <ArrowLeft size={15} />
    Back to dashboard
  </a>
);

const InfoBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="bg-white p-4 neo-border neo-shadow">
    <h2 className="mb-3 text-sm font-black uppercase tracking-normal">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </article>
);

const Info = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => (
  <div className={wide ? 'sm:col-span-2' : ''}>
    <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/50">{label}</p>
    <p className="mt-1 break-words text-sm font-bold leading-5">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow">Loading project...</p>
  </main>
);
