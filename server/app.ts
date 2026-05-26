import express from 'express';
import { isDatabaseUnavailable } from './db/dbErrors.ts';
import { authRoutes } from './routes/authRoutes.ts';
import { projectRoutes } from './routes/projectRoutes.ts';
import { userRoutes } from './routes/userRoutes.ts';

export const createApiApp = () => {
  const app = express();

  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/users', userRoutes);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);

    if (isDatabaseUnavailable(error)) {
      res.status(503).json({ error: 'Database is not connected. Start PostgreSQL and run the seed script, then try again.' });
      return;
    }

    res.status(500).json({ error: 'Something went wrong on the server.' });
  });

  return app;
};
