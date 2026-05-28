import bcrypt from 'bcrypt';
import { getSupabase } from './supabase.js';

type AdminPasswordRow = {
  id: string;
  email: string;
  password: string;
};

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);

const runMigration = async () => {
  const { data, error } = await getSupabase()
    .from('users')
    .select('id, email, password')
    .eq('role', 'admin')
    .returns<AdminPasswordRow[]>();

  if (error) throw new Error(error.message);

  const admins = data ?? [];
  const plaintextAdmins = admins.filter((admin) => !isBcryptHash(admin.password));

  for (const admin of plaintextAdmins) {
    const passwordHash = await bcrypt.hash(admin.password, 12);
    const { error: updateError } = await getSupabase().from('users').update({ password: passwordHash }).eq('id', admin.id);

    if (updateError) throw new Error(updateError.message);
    console.log(`Updated admin password hash for ${admin.email}`);
  }

  console.log(`Password hash migration complete. Updated ${plaintextAdmins.length} admin account(s).`);
};

runMigration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
