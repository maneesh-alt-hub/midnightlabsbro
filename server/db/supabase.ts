import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

const createSupabaseClient = () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export const getSupabase = () => {
  supabaseClient ??= createSupabaseClient();
  return supabaseClient;
};
