import mongoose from 'mongoose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { connectDb, disconnectDb, redactUri } from './db.js';
import { env } from './env.js';

describe('database connection', () => {
  beforeAll(async () => {
    await connectDb(env.MONGODB_URI, { maxAttempts: 1 });
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it('supports multi-document transactions (replica set)', async () => {
    const collection = mongoose.connection.collection('tx_probe');
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await collection.insertOne({ n: 1 }, { session });
        await collection.insertOne({ n: 2 }, { session });
      });
    } finally {
      await session.endSession();
    }
    expect(await collection.countDocuments()).toBe(2);
  });

  it('rolls back everything when a transaction aborts', async () => {
    const collection = mongoose.connection.collection('tx_rollback');
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await collection.insertOne({ n: 1 }, { session });
        await session.abortTransaction();
      });
    } finally {
      await session.endSession();
    }
    expect(await collection.countDocuments()).toBe(0);
  });

  it('has sanitizeFilter and strictQuery enabled', () => {
    expect(mongoose.get('sanitizeFilter')).toBe(true);
    expect(mongoose.get('strictQuery')).toBe(true);
  });
});

describe('redactUri', () => {
  it('hides the password in connection strings', () => {
    expect(redactUri('failed: mongodb+srv://user:p4ss@cluster0.x.mongodb.net/db')).toBe(
      'failed: mongodb+srv://user:****@cluster0.x.mongodb.net/db',
    );
  });
});
