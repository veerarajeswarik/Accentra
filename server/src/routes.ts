/**
 * Mounts every feature module's router under /api/v1. Add new modules here.
 * A factory (not a singleton) so each app instance — and each test — gets fresh
 * per-route state such as rate-limit counters.
 */
import { Router } from 'express';
import { createContactRouter } from './modules/contact/contact.routes.js';
import { healthRouter } from './modules/health/health.routes.js';

export function createApiRouter(): Router {
  const api = Router();
  api.use(healthRouter);
  api.use(createContactRouter());
  return api;
}
