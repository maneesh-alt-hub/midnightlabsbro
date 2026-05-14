
import * as React from 'react';
import { motion } from 'motion/react';

export const LoadingScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
    className="fixed inset-0 z-[100] bg-brand-cream flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative">
      <motion.div
        animate={{ 
          rotate: 360,
          borderRadius: ["20%", "50%", "50%", "20%"],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 neo-border bg-brand-primary neo-shadow-lg"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center font-black text-white text-xl"
      >
        ML
      </motion.div>
    </div>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-8 text-center"
    >
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-2">MIDNIGHT LABS</h2>
      <div className="w-48 h-1 bg-brand-ink/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full bg-brand-primary"
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-50 italic">Synthesizing Automation...</p>
    </motion.div>
  </motion.div>
);
