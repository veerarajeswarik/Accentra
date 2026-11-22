import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createApp } from '../app.js';
import { AppError } from '../lib/app-error.js';
import { createErrorHandler } from './error-handler.js';

/** A tiny app with routes that fail in different ways. */
function buildFailingApp(isProduction: boolean) {
  const app = express();
  app.use(express.json({ limit: '1kb' }));
  app.get('/boom', () => {
    throw new Error('secret internal detail: connection string xyz');
  });
  app.get('/async-boom', async () => {
    await Promise.resolve();
    throw new Error('async failure');
  });
  app.get('/missing', () => {
    throw AppError.notFound('Invoice not found');
  });
  app.get('/zod', () => {
    z.object({ amountPaise: z.number().int() }).parse({ amountPaise: 1.5 });
  });
  app.post('/echo', (req, res) => {
    res.json({ data: req.body as unknown });
  });
  app.use(createErrorHandler({ isProduction }));
  return app;
}

describe('404 handler', () => {
  it('returns the error envelope for unknown routes', async () => {
    const res = await request(createApp()).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route GET /api/v1/does-not-exist does not exist' },
    });
  });
});

describe('error handler', () => {
  it('hides the message and stack trace of unexpected errors in production', async () => {
    const res = await request(buildFailingApp(true)).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL', message: 'Something went wrong. Please try again.' },
    });
    expect(JSON.stringify(res.body)).not.toContain('secret');
    expect(JSON.stringify(res.body)).not.toContain('at ');
  });

  it('includes debugging details outside production', async () => {
    const res = await request(buildFailingApp(false)).get('/boom');

    expect(res.status).toBe(500);
    const body = res.body as { error: { details: { message: string; stack: string }[] } };
    expect(body.error.details[0]?.message).toContain('secret internal detail');
    expect(body.error.details[0]?.stack).toContain('Error');
  });

  it('catches errors thrown by async handlers (Express 5)', async () => {
    const res = await request(buildFailingApp(true)).get('/async-boom');
    expect(res.status).toBe(500);
    expect((res.body as { error: { code: string } }).error.code).toBe('INTERNAL');
  });

  it('maps AppError to its status and code', async () => {
    const res = await request(buildFailingApp(true)).get('/missing');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Invoice not found' } });
  });

  it('maps Zod errors to VALIDATION_ERROR with field details', async () => {
    const res = await request(buildFailingApp(true)).get('/zod');
    expect(res.status).toBe(400);
    const body = res.body as { error: { code: string; details: { path: string }[] } };
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details[0]?.path).toBe('amountPaise');
  });

  it('rejects malformed JSON with a clear message', async () => {
    const res = await request(buildFailingApp(true))
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Request body is not valid JSON' },
    });
  });

  it('rejects bodies over the size limit', async () => {
    const res = await request(buildFailingApp(true))
      .post('/echo')
      .send({ text: 'x'.repeat(2048) });
    expect(res.status).toBe(413);
    expect((res.body as { error: { code: string } }).error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});
