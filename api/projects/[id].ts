import { firstQueryValue, handleApi } from '../_handler.ts';

export default handleApi((req) => `/api/projects/${firstQueryValue(req.query?.id) ?? ''}`);
