/**
 * Error codes used in the API error envelope (MASTER_PLAN Part 3.8).
 * { "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  INTERNAL: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
