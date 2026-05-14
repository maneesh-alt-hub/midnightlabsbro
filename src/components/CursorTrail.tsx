
import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const CursorTrail = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<'none' | 'link' | 'text'>('none');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as Element;
      if (target && typeof target.closest === 'function') {
        const isClickable = !!target.closest('button, a, input, textarea');
        const isText = !!target.closest('h1, h2, h3, h4, p, span') && !isClickable;
        
        setIsHovering(isClickable || isText);
        setHoverType(isClickable ? 'link' : isText ? 'text' : 'none');
      } else {
        setIsHovering(false);
        setHoverType('none');
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      animate={{ 
        x: mousePos.x - (isHovering ? 24 : 16), 
        y: mousePos.y - (isHovering ? 24 : 16),
        scale: isHovering ? (hoverType === 'link' ? 1.8 : 1.4) : 1,
        rotate: isHovering ? (hoverType === 'link' ? 45 : -45) : 0,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
    >
      <div 
        className={`w-full h-full border-2 border-white rounded-none transition-all duration-300 ${
          hoverType === 'link' ? 'bg-white' : hoverType === 'text' ? 'border-brand-primary scale-125' : 'bg-transparent'
        }`}
        style={{ 
          boxShadow: isHovering 
            ? (hoverType === 'link' ? '4px 4px 0px 0px white' : '0px 0px 0px 0px white') 
            : '2px 2px 0px 0px white' 
        }} 
      />
      {hoverType === 'link' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[6px] font-black uppercase text-brand-ink rotate-[-45deg]">VIEW</div>
        </div>
      )}
      {hoverType === 'text' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] font-black text-brand-primary uppercase tracking-widest bg-brand-cream border border-brand-primary px-1">
          READING
        </div>
      )}
    </motion.div>
  );
};
