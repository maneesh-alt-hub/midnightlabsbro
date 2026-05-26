import { firstQueryValue, handleApi } from '../_handler.js';

export default handleApi((req) => `/api/projects/${firstQueryValue(req.query?.id) ?? ''}`);
