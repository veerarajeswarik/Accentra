/** Mounts every feature module's router under /api/v1. Add new modules here. */
import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
