import * as React from 'react';
import { motion } from 'motion/react';
import { STEPS } from '../../constants';
import { SectionTitle } from '../ui/SectionTitle';

export const Process = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-brand-cream border-y-2 border-brand-ink relative overflow-hidden" id="process">
      <div className="dotted-bg absolute inset-0 opacity-20"></div>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <SectionTitle>HOW WE WORK</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mt-20">
          <div className="hidden md:block absolute top-[24px] left-[15%] right-[15%] h-[2px] bg-brand-ink -z-10"></div>
          {STEPS.map((step, i) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-brand-primary text-white neo-border flex items-center justify-center font-bold text-xl mb-4 neo-shadow group-hover:neo-shadow-lg transition-all group-hover:-translate-y-1">
                {step.id}
              </div>
              <h4 className="font-bold uppercase tracking-widest text-sm group-hover:translate-y-1 transition-transform">{step.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
