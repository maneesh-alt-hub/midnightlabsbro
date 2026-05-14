import * as React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const Hero = () => {
  return (
    <section className="pt-40 pb-20 px-4 md:px-6 dotted-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: [0, -15, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="max-w-4xl w-full relative z-10"
      >
        <Card className="p-8 md:p-12 lg:p-16 text-center neo-shadow-lg bg-white relative overflow-hidden group">
          {/* Decorative dots in corners */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-brand-ink group-hover:scale-150 transition-transform"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-brand-ink group-hover:scale-150 transition-transform"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-brand-ink group-hover:scale-150 transition-transform"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-brand-ink group-hover:scale-150 transition-transform"></div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase mb-8 text-brand-ink opacity-60"
          >
            INDUSTRIAL AI SYSTEMS
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-brand-primary mb-12 drop-shadow-[4px_4px_0px_#1a1a1a] transition-all group-hover:scale-105 duration-500"
          >
            MIDNIGHT<br />LABS
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
          >
            <Button variant="primary" className="whitespace-nowrap">See Our Work</Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center whitespace-nowrap">
              <MessageSquare size={20} />
              Chat on WhatsApp
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </section>
  );
};
