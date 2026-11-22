import type { ErrorCode } from '../constants/error-codes.js';

/** Pagination info returned with list endpoints. */
export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
}

/** Every successful API response: { data, meta? }. */
export interface ApiSuccess<T> {
  data: T;
  meta?: ApiMeta;
}

/** Every failed API response: { error: { code, message, details? } }. */
export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown[];
  };
}
