import bcrypt from 'bcrypt';
import { getSupabase } from './supabase.js';

const hash = (password: string) => bcrypt.hash(password, 12);

const runSeed = async () => {
  const adminPassword = await hash('midnight-admin');

  const { data, error } = await getSupabase()
    .from('users')
    .upsert(
      [
        {
          name: 'Midnight Admin',
          email: 'admin@midnightlabs.dev',
          password: adminPassword,
          phone: '+91 90000 00001',
          role: 'admin',
          company: 'Midnight Labs',
        },
        {
          name: 'Maneesh Admin',
          email: 'maneeshkhandavalliwork@gmail.com',
          password: adminPassword,
          phone: '+91 90000 00005',
          role: 'admin',
          company: 'Midnight Labs',
        },
      ],
      { onConflict: 'email' },
    )
    .select('id, email');

  if (error) throw new Error(error.message);

  console.log(`Seed complete. Admin accounts: ${data?.map((user) => user.email).join(', ')}`);
};

runSeed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
