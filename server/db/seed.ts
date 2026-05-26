import bcrypt from 'bcrypt';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from './pool.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hash = (password: string) => bcrypt.hash(password, 12);

const runSeed = async () => {
  const schema = await fs.readFile(path.resolve(__dirname, 'schema.sql'), 'utf8');
  await query(schema);

  const adminPassword = await hash('midnight-admin');
  const ownerAdminPassword = await hash('midnight-admin');
  const admin = await query<{ id: string }>(
    `
      INSERT INTO users (name, email, password, phone, role, company)
      VALUES ($1, $2, $3, $4, 'admin', $5)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        company = EXCLUDED.company
      RETURNING id
    `,
    ['Midnight Admin', 'admin@midnightlabs.dev', adminPassword, '+91 90000 00001', 'Midnight Labs'],
  );

  await query<{ id: string }>(
    `
      INSERT INTO users (name, email, password, phone, role, company)
      VALUES ($1, $2, $3, $4, 'admin', $5)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        company = EXCLUDED.company
      RETURNING id
    `,
    ['Maneesh Admin', 'maneeshkhandavalliwork@gmail.com', ownerAdminPassword, '+91 90000 00005', 'Midnight Labs'],
  );

  await query('DELETE FROM projects');

  console.log(`Seed complete. Admin id: ${admin.rows[0].id}`);
};

runSeed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
