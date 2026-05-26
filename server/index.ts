import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { env, isProduction } from './config/env.ts';
import { isDatabaseUnavailable } from './db/dbErrors.ts';
import { authRoutes } from './routes/authRoutes.ts';
import { projectRoutes } from './routes/projectRoutes.ts';
import { userRoutes } from './routes/userRoutes.ts';

const root = process.cwd();
const app = express();
const errorHandler = (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);

  if (isDatabaseUnavailable(error)) {
    res.status(503).json({ error: 'Database is not connected. Start PostgreSQL and run the seed script, then try again.' });
    return;
  }

  res.status(500).json({ error: 'Something went wrong on the server.' });
};

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

if (isProduction) {
  app.use(express.static(path.resolve(root, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(root, 'dist/index.html'));
  });
} else {
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    try {
      const template = await fs.readFile(path.resolve(root, 'index.html'), 'utf8');
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'content-type': 'text/html' }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Midnight Labs app running at ${env.appUrl}`);
});
