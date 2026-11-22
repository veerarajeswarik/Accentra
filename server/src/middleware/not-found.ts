import type { RequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';

/** Any request that no route handled becomes a NOT_FOUND error envelope. */
export const notFound: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path} does not exist`));
};
