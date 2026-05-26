export type UserRole = 'admin' | 'client';
export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  company: string | null;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  start_date: string;
  deadline: string;
  total_price: string;
  amount_paid: string;
  notes: string | null;
  completed_work: string | null;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
}

export interface JwtPayload extends AuthUser {
  iat: number;
  exp: number;
}
