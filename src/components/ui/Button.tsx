
import * as React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = "",
  onClick 
}: ButtonProps) => {
  const variants = {
    primary: "bg-brand-primary text-white",
    secondary: "bg-brand-sand text-brand-ink",
    outline: "bg-white text-brand-ink"
  };

  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 font-bold uppercase tracking-wider neo-border neo-shadow-hover ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
