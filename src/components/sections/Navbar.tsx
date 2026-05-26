import * as React from 'react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DigitalClock } from '../DigitalClock';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b-2 border-brand-ink px-4 md:px-6 py-3 md:py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & Desktop Desktop Links Left */}
        <div className="flex gap-4 lg:gap-8 items-center text-brand-ink">
          <div className="hidden lg:flex gap-6 items-center">
            {navLinks.slice(0, 2).map((link) => (
              <a key={link.name} href={link.href} className="font-bold text-[10px] uppercase tracking-widest hover:text-brand-primary transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden sm:block">
            <DigitalClock />
          </div>
        </div>

        {/* Brand Logo - Center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="font-black text-lg md:text-2xl uppercase tracking-[0.2em] text-brand-ink leading-none">
            MIDNIGHT LABS
          </div>
        </div>

        {/* Desktop Links Right & Action */}
        <div className="flex gap-4 lg:gap-8 items-center">
          <div className="hidden lg:block">
             <a href="#team" className="font-bold text-[10px] uppercase tracking-widest hover:text-brand-primary transition-colors text-brand-ink">Team</a>
          </div>
          <a
            href="/login"
            className="hidden sm:block bg-brand-ink text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider neo-border hover:bg-brand-primary transition-colors cursor-pointer active:translate-y-1"
          >
            Login
          </a>
          
          {/* Mobile Menu Trigger */}
          <button 
            className="lg:hidden p-2 text-brand-ink"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-brand-cream border-b-2 border-brand-ink p-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="font-black text-xl uppercase tracking-tighter text-brand-ink hover:text-brand-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a href="/login" className="bg-brand-ink text-white px-6 py-4 font-black uppercase tracking-widest neo-border w-full text-center">
              LOGIN
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
