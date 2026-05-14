import * as React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../../constants';

export const Stats = () => {
  return (
    <section className="py-24 dotted-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-brand-ink"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-ink"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 py-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                type: "spring",
                damping: 12,
                stiffness: 100
              }}
            >
              <div className={`p-6 md:p-10 text-center h-full flex flex-col justify-center items-center group relative neo-border shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-1 md:hover:translate-x-2 hover:translate-y-1 md:hover:translate-y-2 transition-all duration-300 ${stat.color}`}>
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-6 group-hover:scale-110 transition-transform tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] leading-none italic">
                  {stat.value}
                </div>
                <div className="text-[8px] md:text-[10px] lg:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-90 drop-shadow-sm leading-tight">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
