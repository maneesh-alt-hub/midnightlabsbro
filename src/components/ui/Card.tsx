
import * as React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noShadow?: boolean;
}

export const Card = ({ children, className = "", noShadow = false }: CardProps) => (
  <div className={`bg-white neo-border ${noShadow ? '' : 'neo-shadow'} ${className}`}>
    {children}
  </div>
);
