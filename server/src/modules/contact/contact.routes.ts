import { contactMessageSchema } from '@accentra/shared';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AppError } from '../../lib/app-error.js';
import { validateBody } from '../../middleware/validate.js';
import { postContactHandler } from './contact.controller.js';

export const CONTACT_RATE_LIMIT = { windowMs: 15 * 60 * 1000, limit: 5 } as const;

/**
 * POST /api/v1/contact — public, no auth. Strict limit: 5 requests / 15 min / IP.
 * In-memory counter: fine for one server instance; Phase 26 moves it to a shared store
 * if we ever run more than one.
 */
export function createContactRouter(): Router {
  const router = Router();

  const limiter = rateLimit({
    ...CONTACT_RATE_LIMIT,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new AppError(
          'RATE_LIMITED',
          'Too many messages from this connection. Please try again in 15 minutes.',
        ),
      );
    },
  });

  router.post('/contact', limiter, validateBody(contactMessageSchema), postContactHandler);
  return router;
}
