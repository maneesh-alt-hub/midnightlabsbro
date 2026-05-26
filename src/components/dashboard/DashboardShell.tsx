import * as React from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '../../lib/api.ts';
import type { AuthUser } from '../../types/dashboard.ts';

export const DashboardShell = ({
  children,
  title,
  subtitle,
  user,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  user: AuthUser;
}) => {
  const signOut = async () => {
    await logout();
    window.location.assign('/login');
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <header className="border-b-2 border-brand-ink bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <a href="/" className="text-xs font-black uppercase tracking-widest text-brand-primary hover:text-brand-ink">
              Midnight Labs
            </a>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-normal sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-brand-ink/65">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-brand-sand px-3 py-2 text-xs font-black uppercase tracking-widest neo-border">{user.name}</span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 bg-brand-ink px-4 py-3 text-xs font-black uppercase tracking-widest text-white neo-border neo-shadow-hover"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
};
