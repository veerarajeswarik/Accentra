/**
 * AppError: an error we expect and can explain to the user.
 * Throw one from any service/controller; the error handler turns it into
 *   { "error": { "code", "message", "details?" } } with the right HTTP status.
 */
import { ERROR_CODES, type ErrorCode } from '@accentra/shared';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: unknown[] | undefined;

  constructor(code: ErrorCode, message: string, details?: unknown[]) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = ERROR_CODES[code];
    this.details = details;
  }

  static badRequest(message = 'The request is invalid', details?: unknown[]): AppError {
    return new AppError('VALIDATION_ERROR', message, details);
  }

  static unauthenticated(message = 'Please sign in to continue'): AppError {
    return new AppError('UNAUTHENTICATED', message);
  }

  static forbidden(message = 'You do not have permission to do this'): AppError {
    return new AppError('FORBIDDEN', message);
  }

  static notFound(message = 'Not found'): AppError {
    return new AppError('NOT_FOUND', message);
  }

  static conflict(message = 'This conflicts with existing data', details?: unknown[]): AppError {
    return new AppError('CONFLICT', message, details);
  }
}
