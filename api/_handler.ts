import { createApiApp } from '../server/app.js';

const app = createApiApp();

export const handleApi =
  (pathForRequest: (req: { query?: Record<string, string | string[] | undefined>; url?: string }) => string) =>
  (req: { query?: Record<string, string | string[] | undefined>; url?: string }, res: unknown) => {
    const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    req.url = `${pathForRequest(req)}${query}`;
    return app(req as never, res as never);
  };

export const firstQueryValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
