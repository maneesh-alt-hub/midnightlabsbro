import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
