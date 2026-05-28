import * as React from 'react';
import { X } from 'lucide-react';

export const DashboardModal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[80] grid place-items-center bg-brand-ink/35 px-4 py-6">
    <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-white neo-border neo-shadow-lg">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-brand-ink bg-white px-4 py-3">
        <h2 className="text-lg font-black uppercase tracking-normal">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center bg-brand-cream neo-border hover:bg-brand-ink hover:text-white"
          aria-label="Close modal"
          title="Close"
        >
          <X size={18} />
        </button>
      </header>
      <div className="p-4">{children}</div>
    </section>
  </div>
);
