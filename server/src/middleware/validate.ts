import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

/**
 * Validate req.body with a shared Zod schema and replace it with the parsed (trimmed,
 * normalised) value. Failures go to the error handler as 400 VALIDATION_ERROR with
 * per-field details: [{ path, message }].
 */
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
}
