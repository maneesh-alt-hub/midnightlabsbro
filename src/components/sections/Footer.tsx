import * as React from 'react';

export const Footer = () => {
  return (
    <footer className="py-16 px-4 md:px-6 border-t-2 border-brand-ink bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-brand-ink">
        <div className="text-center md:text-left">
          <div className="font-black text-2xl uppercase tracking-widest mb-4 hover:text-brand-primary transition-colors cursor-pointer">MIDNIGHT LABS</div>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">© 2024 Midnight Labs. Built for Industrial Precision.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {['Privacy Policy', 'Terms of Service', 'Github', 'Linkedin'].map((link) => (
            <a key={link} href="#" className="font-bold text-[10px] uppercase tracking-[0.2em] hover:text-brand-primary transition-colors relative group">
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
