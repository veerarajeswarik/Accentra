import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { connectDb, disconnectDb } from '../../config/db.js';
import { env } from '../../config/env.js';
import { hashIp } from '../../lib/hash-ip.js';
import { ContactMessageModel } from '../../models/contact-message.model.js';

const valid = {
  name: 'Sample Person',
  email: 'Sample.Person@Example.com',
  role: 'entrepreneur',
  subject: 'Question about reviews',
  message: 'How does my CA ask for clarification on a document?',
};

type ErrorBody = { error: { code: string; details?: { path: string; message: string }[] } };

describe('POST /api/v1/contact', () => {
  beforeAll(async () => {
    await connectDb(env.MONGODB_URI, { maxAttempts: 1 });
  });

  beforeEach(async () => {
    await ContactMessageModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it('stores a valid message and returns 201 with its id', async () => {
    const res = await request(createApp())
      .post('/api/v1/contact')
      .set('User-Agent', 'vitest-agent')
      .send(valid);

    expect(res.status).toBe(201);
    const { id } = (res.body as { data: { id: string } }).data;
    const stored = await ContactMessageModel.findById(id).lean();
    expect(stored).toMatchObject({
      name: 'Sample Person',
      email: 'sample.person@example.com', // lowercased
      role: 'entrepreneur',
      status: 'new',
      userAgent: 'vitest-agent',
    });
  });

  it('stores a keyed hash of the IP, never the raw IP', async () => {
    const res = await request(createApp()).post('/api/v1/contact').send(valid);
    const stored = await ContactMessageModel.findById(
      (res.body as { data: { id: string } }).data.id,
    ).lean();

    expect(stored?.ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(stored)).not.toMatch(/127\.0\.0\.1|::1|::ffff/);
    expect(hashIp('1.2.3.4')).not.toBe(hashIp('1.2.3.4', 'a-different-pepper-value-xxxxxxxxxxxx'));
  });

  it('rejects an invalid email with 400 and a field error', async () => {
    const res = await request(createApp())
      .post('/api/v1/contact')
      .send({ ...valid, email: 'not-an-email' });

    expect(res.status).toBe(400);
    const body = res.body as ErrorBody;
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details).toContainEqual({
      path: 'email',
      message: 'validation:email.invalid',
    });
    expect(await ContactMessageModel.countDocuments()).toBe(0);
  });

  it('rejects a message shorter than 20 characters with 400', async () => {
    const res = await request(createApp())
      .post('/api/v1/contact')
      .send({ ...valid, message: 'Too short' });

    expect(res.status).toBe(400);
    expect((res.body as ErrorBody).error.details).toContainEqual({
      path: 'message',
      message: 'validation:message.tooShort',
    });
  });

  it('pretends success but stores nothing when the honeypot is filled', async () => {
    const res = await request(createApp())
      .post('/api/v1/contact')
      .send({ ...valid, website: 'http://spam.example' });

    expect(res.status).toBe(201);
    expect((res.body as { data: { id: string } }).data.id).toMatch(/^[0-9a-f]{24}$/);
    expect(await ContactMessageModel.countDocuments()).toBe(0);
  });

  it('returns 429 RATE_LIMITED on the 6th request in 15 minutes', async () => {
    const app = createApp();
    for (let i = 0; i < 5; i++) {
      const ok = await request(app).post('/api/v1/contact').send(valid);
      expect(ok.status).toBe(201);
    }

    const sixth = await request(app).post('/api/v1/contact').send(valid);

    expect(sixth.status).toBe(429);
    expect((sixth.body as ErrorBody).error.code).toBe('RATE_LIMITED');
    expect(sixth.headers['ratelimit-policy']).toBeDefined();
    expect(await ContactMessageModel.countDocuments()).toBe(5);
  });
});
