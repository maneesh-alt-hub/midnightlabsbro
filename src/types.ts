
import { ReactNode } from 'react';

export interface Service {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor: string;
}

export interface Step {
  id: string;
  title: string;
}

export interface Stat {
  label: string;
  value: string;
  color: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  portfolio: string;
}

export interface Project {
  title: string;
  category: string;
  desc: string;
  icon: ReactNode;
  color: string;
}
