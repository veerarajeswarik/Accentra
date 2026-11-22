/**
 * Centralized error handler. Every error leaves the API in ONE shape:
 *   { "error": { "code": "...", "message": "...", "details": [...]? } }
 * In production, unexpected errors never reveal their message or stack trace.
 */
import type { ApiErrorBody } from '@accentra/shared';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { AppError } from '../lib/app-error.js';

interface BodyParserError extends Error {
  type?: string;
  status?: number;
}

function isBodyParserError(err: unknown): err is BodyParserError {
  return err instanceof Error && typeof (err as BodyParserError).type === 'string';
}

export interface ErrorHandlerOptions {
  /** When true, internal error messages and stack traces are hidden. */
  isProduction: boolean;
}

export function createErrorHandler({ isProduction }: ErrorHandlerOptions): ErrorRequestHandler {
  return (err: unknown, req, res, _next) => {
    let status: number;
    let body: ApiErrorBody;

    if (err instanceof AppError) {
      status = err.status;
      body = { error: { code: err.code, message: err.message } };
      if (err.details) body.error.details = err.details;
    } else if (err instanceof ZodError) {
      status = 400;
      body = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Some fields are invalid',
          details: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
      };
    } else if (isBodyParserError(err) && err.type === 'entity.parse.failed') {
      status = 400;
      body = { error: { code: 'VALIDATION_ERROR', message: 'Request body is not valid JSON' } };
    } else if (isBodyParserError(err) && err.type === 'entity.too.large') {
      status = 413;
      body = { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } };
    } else {
      status = 500;
      logger.error({ err, reqId: req.id }, 'Unhandled error');
      body = { error: { code: 'INTERNAL', message: 'Something went wrong. Please try again.' } };
      if (!isProduction && err instanceof Error) {
        body.error.details = [{ message: err.message, stack: err.stack }];
      }
    }

    res.status(status).json(body);
  };
}
