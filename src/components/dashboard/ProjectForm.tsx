import * as React from 'react';
import { useEffect, useState } from 'react';
import type { AuthUser, Project, ProjectPayload, ProjectStatus } from '../../types/dashboard.ts';

const emptyProject: ProjectPayload = {
  client_id: '',
  name: '',
  description: '',
  status: 'not_started',
  start_date: '',
  deadline: '',
  total_price: 0,
  amount_paid: 0,
  notes: '',
  completed_work: '',
};

const toFormValue = (project?: Project | null): ProjectPayload =>
  project
    ? {
        client_id: project.client_id,
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.start_date,
        deadline: project.deadline,
        total_price: Number(project.total_price),
        amount_paid: Number(project.amount_paid),
        notes: project.notes ?? '',
        completed_work: project.completed_work ?? '',
      }
    : emptyProject;

export const ProjectForm = ({
  clients,
  project,
  onSubmit,
  submitLabel,
}: {
  clients: AuthUser[];
  project?: Project | null;
  onSubmit: (payload: ProjectPayload) => Promise<void>;
  submitLabel: string;
}) => {
  const [form, setForm] = useState<ProjectPayload>(toFormValue(project));
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(toFormValue(project));
  }, [project]);

  const update = (field: keyof ProjectPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'total_price' || field === 'amount_paid' ? Number(value) : value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await onSubmit(form);
      if (!project) setForm(emptyProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 neo-border neo-shadow">
      <h2 className="text-lg font-black uppercase tracking-normal">{submitLabel}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Project name" value={form.name} onChange={(value) => update('name', value)} />
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">Client</span>
          <select
            value={form.client_id}
            onChange={(event) => update('client_id', event.target.value)}
            className="w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
            required
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">Description</span>
        <textarea
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
          className="min-h-20 w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
          required
        />
      </label>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">Status</span>
          <select
            value={form.status}
            onChange={(event) => update('status', event.target.value as ProjectStatus)}
            className="w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <Field label="Start date" type="date" value={form.start_date} onChange={(value) => update('start_date', value)} />
        <Field label="Deadline" type="date" value={form.deadline} onChange={(value) => update('deadline', value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Total price" type="number" value={String(form.total_price)} onChange={(value) => update('total_price', value)} />
        <Field label="Amount paid" type="number" value={String(form.amount_paid)} onChange={(value) => update('amount_paid', value)} />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">Progress updates</span>
        <textarea
          value={form.completed_work}
          onChange={(event) => update('completed_work', event.target.value)}
          className="min-h-16 w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">Internal notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          className="min-h-16 w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
        />
      </label>
      {error && <p className="bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-brand-primary px-4 py-3 text-xs font-black uppercase tracking-widest text-white neo-border neo-shadow-hover disabled:cursor-wait disabled:opacity-70"
      >
        {isSaving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
      required
    />
  </label>
);
