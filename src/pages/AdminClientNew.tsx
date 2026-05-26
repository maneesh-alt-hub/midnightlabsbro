import * as React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createClient, dashboardPath, getSession } from '../lib/api.ts';
import type { AuthUser } from '../types/dashboard.ts';
import { DashboardShell } from '../components/dashboard/DashboardShell.tsx';
import { ClientForm } from '../components/dashboard/ClientForm.tsx';

export const AdminClientNew = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(({ user }) => {
        if (!user) {
          window.location.replace('/login');
          return;
        }
        if (user.role !== 'admin') {
          window.location.replace(dashboardPath(user.role));
          return;
        }
        setUser(user);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <DashboardShell title="Create client" subtitle="Add a clean client account without leaving the admin workspace." user={user}>
      <div className="mb-6">
        <a href="/admin/dashboard" className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest neo-border neo-shadow-hover">
          <ArrowLeft size={16} />
          Back to dashboard
        </a>
      </div>
      <div className="max-w-3xl">
        <ClientForm
          submitLabel="Create client"
          onSubmit={async (payload) => {
            await createClient(payload);
            window.location.assign('/admin/dashboard');
          }}
        />
      </div>
    </DashboardShell>
  );
};

const LoadingScreen = () => (
  <main className="grid min-h-screen place-items-center bg-brand-cream">
    <p className="bg-white px-5 py-4 text-sm font-black uppercase tracking-widest neo-border neo-shadow">Loading form...</p>
  </main>
);
