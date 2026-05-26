import dotenv from 'dotenv';
import path from 'node:path';

const root = process.cwd();

dotenv.config({ path: path.resolve(root, '.env.local') });
dotenv.config({ path: path.resolve(root, '.env') });

export const env = {
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/midnight_labs',
  jwtSecret: process.env.JWT_SECRET ?? 'replace-this-local-secret-before-production',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
};

export const isProduction = env.nodeEnv === 'production';
