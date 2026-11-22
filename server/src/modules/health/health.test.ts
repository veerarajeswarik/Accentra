import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { connectDb, disconnectDb } from '../../config/db.js';
import { env } from '../../config/env.js';

const app = createApp();

describe('GET /api/v1/health', () => {
  beforeAll(async () => {
    await connectDb(env.MONGODB_URI, { maxAttempts: 1 });
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it('returns 200 with status ok and db up', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        status: 'ok',
        db: 'up',
        version: expect.any(String) as string,
        time: expect.any(String) as string,
      },
    });
    expect(Number.isNaN(Date.parse((res.body as { data: { time: string } }).data.time))).toBe(
      false,
    );
  });

  it('sets security headers and a request id', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.headers['x-request-id']).toMatch(/^[\w-]+$/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('only allows the configured client origin (CORS)', async () => {
    const allowed = await request(app).get('/api/v1/health').set('Origin', env.CLIENT_ORIGIN);
    expect(allowed.headers['access-control-allow-origin']).toBe(env.CLIENT_ORIGIN);
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');

    // A fixed allow-origin header never echoes another site's origin, so the browser blocks it.
    const other = await request(app).get('/api/v1/health').set('Origin', 'https://evil.example');
    expect(other.headers['access-control-allow-origin']).toBe(env.CLIENT_ORIGIN);
    expect(other.headers['access-control-allow-origin']).not.toBe('https://evil.example');
  });

  it('reports db down (still 200) when the database is disconnected', async () => {
    await disconnectDb();

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect((res.body as { data: { db: string } }).data.db).toBe('down');
  });
});
