
import * as React from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const SectionTitle = ({ children, subtitle, className = "" }: SectionTitleProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    className={`mb-12 ${className}`}
  >
    {subtitle && <p className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2">{subtitle}</p>}
    <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">{children}</h2>
  </motion.div>
);
