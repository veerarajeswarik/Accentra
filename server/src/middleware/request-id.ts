import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const SAFE_ID = /^[\w-]{1,64}$/;

/**
 * Give every request an id (re-using a well-formed incoming X-Request-Id from a proxy).
 * The id appears in every log line for that request and in the X-Request-Id response header,
 * so a user-reported error can be matched to the server log.
 */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.get('x-request-id');
  const id = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};
