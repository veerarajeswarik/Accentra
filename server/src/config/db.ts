/**
 * MongoDB connection (Mongoose).
 * - Retries with exponential backoff, so a temporary Atlas problem does not crash the server.
 * - Logs every connection state change.
 * - strictQuery + sanitizeFilter: unknown fields and `$`-operator injection are blocked.
 */
import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);

let listenersAttached = false;

function attachConnectionLogging(): void {
  if (listenersAttached) return;
  listenersAttached = true;
  const conn = mongoose.connection;
  conn.on('connected', () => logger.info({ db: conn.name }, 'MongoDB connected'));
  conn.on('disconnected', () => logger.warn('MongoDB disconnected'));
  conn.on('reconnected', () => logger.info('MongoDB reconnected'));
  conn.on('error', (err: Error) => logger.error({ err: err.message }, 'MongoDB connection error'));
}

export interface ConnectOptions {
  /** Stop after this many failed attempts (default: keep trying forever). */
  maxAttempts?: number;
  /** First retry delay in ms; doubles after each failure, up to 30 s. */
  initialDelayMs?: number;
}

const MAX_DELAY_MS = 30_000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Hide the password if a connection string ever appears in an error message. */
export function redactUri(text: string): string {
  return text.replace(/(mongodb(?:\+srv)?:\/\/[^:/@\s]+:)[^@\s]+@/g, '$1****@');
}

export async function connectDb(
  uri: string = env.MONGODB_URI,
  { maxAttempts = Infinity, initialDelayMs = 1_000 }: ConnectOptions = {},
): Promise<void> {
  attachConnectionLogging();
  let delay = initialDelayMs;
  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
      return;
    } catch (error) {
      const message = redactUri(error instanceof Error ? error.message : String(error));
      if (attempt >= maxAttempts) {
        logger.error({ attempt }, `MongoDB connection failed, giving up: ${message}`);
        throw error;
      }
      logger.error(
        { attempt, retryInMs: delay },
        `MongoDB connection failed: ${message}. ` +
          'Check MONGODB_URI in server/.env and Atlas Network Access (your IP address).',
      );
      await wait(delay);
      delay = Math.min(delay * 2, MAX_DELAY_MS);
    }
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}

/** True when the connection is open and the database answers a ping. */
export async function pingDb(): Promise<boolean> {
  const db = mongoose.connection.db;
  if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected || !db) return false;
  try {
    await db.admin().ping();
    return true;
  } catch {
    return false;
  }
}
