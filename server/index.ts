import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { env, isProduction } from './config/env.js';
import { createApiApp } from './app.js';
import { getSessionUser } from './middleware/authMiddleware.js';

const root = process.cwd();
const app = createApiApp();

app.use(['/admin', '/client'], (req, res, next) => {
  const requiredRole = req.originalUrl.startsWith('/admin') ? 'admin' : 'client';
  const user = getSessionUser(req);

  if (!user || user.role !== requiredRole) {
    res.redirect('/login');
    return;
  }

  next();
});

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

app.listen(env.port, () => {
  console.log(`Midnight Labs app running at ${env.appUrl}`);
});
