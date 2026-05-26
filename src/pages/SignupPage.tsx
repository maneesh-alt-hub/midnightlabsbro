import * as React from 'react';
import { useState } from 'react';
import { ArrowLeft, Building2, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { dashboardPath, signup } from '../lib/api.ts';

export const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { user } = await signup(form);
      window.location.assign(dashboardPath(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-cream px-4 py-10 text-brand-ink dotted-bg">
      <section className="w-full max-w-xl bg-white p-6 neo-border neo-shadow-lg sm:p-8">
        <a href="/login" className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-brand-primary">
          <ArrowLeft size={16} />
          Back to login
        </a>
        <h1 className="text-4xl font-black uppercase leading-none tracking-normal">Client signup</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-brand-ink/65">
          Create a client portal account. The team can attach projects to this account from the admin dashboard.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Input icon={<UserRound size={18} />} label="Name" value={form.name} onChange={(value) => update('name', value)} />
          <Input icon={<Mail size={18} />} label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input icon={<Phone size={18} />} label="Phone" value={form.phone} onChange={(value) => update('phone', value)} required={false} />
            <Input icon={<Building2 size={18} />} label="Company" value={form.company} onChange={(value) => update('company', value)} required={false} />
          </div>
          <Input
            icon={<LockKeyhole size={18} />}
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => update('password', value)}
            minLength={8}
          />

          {error && <p className="bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary px-5 py-4 text-sm font-black uppercase tracking-widest text-white neo-border neo-shadow-hover disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account...' : 'Create client account'}
          </button>
        </form>
      </section>
    </main>
  );
};

const Input = ({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  required = true,
  minLength,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase tracking-widest">{label}</span>
    <span className="flex items-center gap-3 bg-brand-cream px-3 py-3 neo-border">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-bold outline-none"
        required={required}
        minLength={minLength}
      />
    </span>
  </label>
);
