import * as React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { TEAM } from '../../constants';
import { SectionTitle } from '../ui/SectionTitle';
import { AnimatedCard } from '../ui/AnimatedCard';

export const Team = () => {
  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto border-t-2 border-brand-ink" id="team">
      <SectionTitle subtitle="OUR TEAM">MEET THE EXPERTS</SectionTitle>
      
      {/* Primary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {TEAM.slice(0, 3).map((member, i) => (
          <AnimatedCard key={i} className="p-0 overflow-hidden flex flex-col h-full group" delay={i * 0.1}>
            <div className="bg-[#e0e0e0] aspect-[16/9] md:aspect-[4/3] w-full neo-border-b flex items-center justify-center p-8 relative overflow-hidden">
              <Users size={64} md-size={84} className="opacity-10 group-hover:opacity-30 transition-opacity" />
              <div className="absolute inset-x-0 bottom-4 text-center">
                 <div className="inline-block px-3 py-1 bg-white neo-border text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-brand-ink">VERIFIED EXPERT</div>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter text-brand-primary mb-1">{member.name}</h3>
              <h4 className="font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] opacity-80 mb-4 text-brand-ink">{member.role}</h4>
              <p className="text-xs md:text-sm leading-relaxed opacity-90 text-brand-ink mb-6 flex-grow">{member.desc}</p>
              <a 
                href={member.portfolio} 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-ink hover:text-brand-primary transition-all group-hover:translate-x-2"
              >
                View Portfolio <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {TEAM.slice(3).map((member, i) => (
          <AnimatedCard key={i} className="p-0 overflow-hidden flex flex-col h-full group" delay={(i + 3) * 0.1}>
            <div className="bg-[#e0e0e0] aspect-[16/9] md:aspect-[4/3] w-full neo-border-b flex items-center justify-center p-8 relative overflow-hidden">
              <Users size={64} md-size={84} className="opacity-10 group-hover:opacity-30 transition-opacity" />
              <div className="absolute inset-x-0 bottom-4 text-center">
                 <div className="inline-block px-3 py-1 bg-white neo-border text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-brand-ink">VERIFIED EXPERT</div>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter text-brand-primary mb-1">{member.name}</h3>
              <h4 className="font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] opacity-80 mb-4 text-brand-ink">{member.role}</h4>
              <p className="text-xs md:text-sm leading-relaxed opacity-90 text-brand-ink mb-6 flex-grow">{member.desc}</p>
              <a 
                href={member.portfolio} 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-ink hover:text-brand-primary transition-all group-hover:translate-x-2"
              >
                View Portfolio <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
};
