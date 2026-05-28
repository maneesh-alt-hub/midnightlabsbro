# Midnight Labs Website

Existing neobrutalist landing page plus a client/admin project dashboard.

## Run Locally

Prerequisites:

- Node.js
- Supabase project

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `JWT_SECRET`
4. Run the SQL in `server/db/schema.supabase.sql` in the Supabase SQL editor
5. Create admin accounts: `npm run db:seed`
6. Start the full-stack app: `npm run dev`
7. Open `http://localhost:3000`

## Routes

- Landing page: `/`
- Login: `/login`
- Client signup: `/signup`
- Admin dashboard: `/admin/dashboard`
- New client from admin: `/admin/clients/new`
- New project: `/admin/projects/new`
- Admin project detail: `/admin/projects/:id`
- Client dashboard: `/client/dashboard`
- Client project detail: `/client/projects/:id`

## Seed Accounts

- Admin: `maneeshkhandavalliwork@gmail.com` / `midnight-admin`
- Admin: `admin@midnightlabs.dev` / `midnight-admin`

No client accounts or projects are created by default. New clients can sign up at `/signup`.

## Database

Schema lives in `server/db/schema.supabase.sql`.

Tables:

- `users`: id, name, email, hashed password, phone, role, company, created_at
- `projects`: id, client_id, name, description, status, dates, pricing, notes, completed work, created_at
