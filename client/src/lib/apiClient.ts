/**
 * The ONE way the client talks to the API.
 * - Base URL is same-origin "/api/v1" (Vite proxy in dev, Vercel rewrite in production).
 * - Sends cookies (credentials: 'include') for the refresh-token flow added in Phase 4.
 * - Turns the server's error envelope { error: { code, message, details } } into an ApiError.
 */
import type { ApiErrorBody, ApiSuccess, ErrorCode } from '@accentra/shared';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';

/** Client-only codes for failures that never reached (or were not understood from) the API. */
export type ClientErrorCode = 'NETWORK_ERROR' | 'BAD_RESPONSE';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode | ClientErrorCode;
  readonly details: unknown[] | undefined;

  constructor(
    status: number,
    code: ErrorCode | ClientErrorCode,
    message: string,
    details?: unknown[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const error = (value as { error: unknown }).error;
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { code?: unknown }).code === 'string' &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

/** Parse a fetch Response into ApiSuccess<T>, or throw an ApiError. Exported for tests. */
export async function parseResponse<T>(response: Response): Promise<ApiSuccess<T>> {
  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = undefined;
    }
  }

  if (!response.ok) {
    if (isErrorBody(body)) {
      throw new ApiError(response.status, body.error.code, body.error.message, body.error.details);
    }
    throw new ApiError(
      response.status,
      'BAD_RESPONSE',
      `The server returned an unexpected error (HTTP ${response.status}).`,
    );
  }

  if (typeof body !== 'object' || body === null || !('data' in body)) {
    throw new ApiError(response.status, 'BAD_RESPONSE', 'The server sent an unexpected response.');
  }
  return body as ApiSuccess<T>;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Sent as JSON. */
  json?: unknown;
}

export async function apiRequest<T>(
  path: string,
  { json, headers, ...init }: RequestOptions = {},
): Promise<ApiSuccess<T>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...init,
      headers: {
        Accept: 'application/json',
        ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
    });
  } catch {
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Could not reach the Accentra server. Check your internet connection and try again.',
    );
  }
  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', json }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
