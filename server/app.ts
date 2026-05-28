import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { projectRoutes } from './routes/projectRoutes.js';
import { userRoutes } from './routes/userRoutes.js';

export const createApiApp = () => {
  const app = express();

  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/users', userRoutes);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);

    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong on the server.' });
  });

  return app;
};
