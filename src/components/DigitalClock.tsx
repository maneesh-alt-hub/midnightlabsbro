
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-brand-ink text-white neo-border">
      <Clock size={12} className="animate-pulse" />
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};
