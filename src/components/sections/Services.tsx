import * as React from 'react';
import { SERVICES } from '../../constants';
import { SectionTitle } from '../ui/SectionTitle';
import { AnimatedCard } from '../ui/AnimatedCard';

export const Services = () => {
  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto" id="services">
      <SectionTitle subtitle="OUR SERVICES">INTELLIGENT AUTOMATION</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, i) => (
          <AnimatedCard key={i} className="p-8 flex flex-col gap-6 h-full group scroll-mt-24" delay={i * 0.1}>
            <div className={`w-12 h-12 neo-border flex items-center justify-center ${service.iconColor} text-white group-hover:rotate-12 transition-transform duration-300`}>
              {service.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold uppercase mb-4 tracking-tight group-hover:text-brand-primary transition-colors">{service.title}</h3>
              <p className="text-brand-ink opacity-80 leading-relaxed">{service.description}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
};
