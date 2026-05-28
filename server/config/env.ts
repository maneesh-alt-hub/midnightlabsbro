import dotenv from 'dotenv';
import path from 'node:path';

const root = process.cwd();

dotenv.config({ path: path.resolve(root, '.env.local') });
dotenv.config({ path: path.resolve(root, '.env') });

export const env = {
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET ?? 'replace-this-local-secret-before-production',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
};

export const isProduction = env.nodeEnv === 'production';
