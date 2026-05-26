import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react';
import { dashboardPath, getSession, login } from '../lib/api.ts';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSession()
      .then(({ user }) => {
        if (user) window.location.replace(dashboardPath(user.role));
      })
      .catch(() => undefined);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { user } = await login(email, password);
      window.location.assign(dashboardPath(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-cream px-4 py-10 text-brand-ink dotted-bg">
      <section className="w-full max-w-xl bg-white p-6 neo-border neo-shadow-lg sm:p-8">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-brand-primary">
          <ArrowLeft size={16} />
          Landing page
        </a>
        <h1 className="text-4xl font-black uppercase leading-none tracking-normal">Portal login</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-brand-ink/65">
          Sign in with the account created for you. Your role decides the dashboard you enter.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest">Email</span>
            <span className="flex items-center gap-3 bg-brand-cream px-3 py-3 neo-border">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm font-bold outline-none"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest">Password</span>
            <span className="flex items-center gap-3 bg-brand-cream px-3 py-3 neo-border">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm font-bold outline-none"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </span>
          </label>
          {error && <p className="bg-brand-primary px-3 py-3 text-sm font-bold text-white neo-border">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary px-5 py-4 text-sm font-black uppercase tracking-widest text-white neo-border neo-shadow-hover disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div className="mt-6 border-t-2 border-brand-ink pt-5">
          <p className="text-sm font-bold text-brand-ink/70">
            New client?{' '}
            <a href="/signup" className="font-black uppercase tracking-widest text-brand-primary hover:text-brand-ink">
              Create an account
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};
