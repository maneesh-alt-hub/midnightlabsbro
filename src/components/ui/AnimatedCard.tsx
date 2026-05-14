
import * as React from 'react';
import { motion } from 'motion/react';
import { Card } from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.1 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className={className}>
      {children}
    </Card>
  </motion.div>
);
