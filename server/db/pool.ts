import pg from 'pg';
import { env } from '../config/env.ts';

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
});

export const query = <T>(text: string, params: unknown[] = []) => pool.query<T>(text, params);
