import * as React from 'react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { PROJECTS } from '../../constants';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';

export const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = new Set(PROJECTS.map(p => p.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto border-t-2 border-brand-ink dotted-bg" id="projects">
      <SectionTitle subtitle="OUR WORK">PROJECTS WE'VE DONE</SectionTitle>
      
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest neo-border transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-brand-primary text-white neo-shadow translate-x-1 translate-y-1' 
                : 'bg-white text-brand-ink hover:bg-brand-sand hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="p-0 overflow-hidden flex flex-col md:flex-row h-full group">
                <div className={`${project.color} md:w-2/5 aspect-[16/9] md:aspect-auto flex items-center justify-center p-8 transition-all group-hover:p-10 neo-border-b md:neo-border-b-0 md:neo-border-r`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {project.icon}
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col items-start bg-white">
                  <div className="inline-block px-3 py-1 bg-brand-ink text-white text-[8px] font-black uppercase tracking-widest mb-4">
                    {project.category}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-brand-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed opacity-80 mb-8 flex-grow">
                    {project.desc}
                  </p>
                  <a href="#" className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform">
                    Case Study <ExternalLink size={16} />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
