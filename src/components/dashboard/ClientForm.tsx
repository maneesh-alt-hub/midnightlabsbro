import * as React from 'react';
import { useState } from 'react';

interface ClientFormValue {
  name: string;
  email: string;
  phone: string;
  company: string;
  password: string;
}

const emptyClient: ClientFormValue = {
  name: '',
  email: '',
  phone: '',
  company: '',
  password: '',
};

export const ClientForm = ({
  onSubmit,
  submitLabel,
}: {
  onSubmit: (payload: ClientFormValue) => Promise<void>;
  submitLabel: string;
}) => {
  const [form, setForm] = useState(emptyClient);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const update = (field: keyof ClientFormValue, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await onSubmit(form);
      setForm(emptyClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create client.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 neo-border neo-shadow">
      <h2 className="text-lg font-black uppercase tracking-normal">{submitLabel}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(value) => update('name', value)} />
        <Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} />
        <Field label="Phone" value={form.phone} onChange={(value) => update('phone', value)} required={false} />
        <Field label="Company" value={form.company} onChange={(value) => update('company', value)} required={false} />
      </div>
      <Field label="Temporary password" type="password" value={form.password} onChange={(value) => update('password', value)} minLength={8} />
      {error && <p className="bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-brand-primary px-4 py-3 text-xs font-black uppercase tracking-widest text-white neo-border neo-shadow-hover disabled:cursor-wait disabled:opacity-70"
      >
        {isSaving ? 'Creating...' : submitLabel}
      </button>
    </form>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  required = true,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-brand-cream px-3 py-2 text-sm font-bold outline-none neo-border"
      required={required}
      minLength={minLength}
    />
  </label>
);
