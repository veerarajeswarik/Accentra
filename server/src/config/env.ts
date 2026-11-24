/**
 * Environment configuration.
 * RULE: this is the ONLY file allowed to read process.env. Everything else imports `env`.
 * The server refuses to start if a variable is missing or invalid, and says which one.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGODB_URI: z
    .string({ error: 'is required (see server/.env.example)' })
    .regex(/^mongodb(\+srv)?:\/\/\S+$/, 'must start with mongodb:// or mongodb+srv://'),
  CLIENT_ORIGIN: z
    .url({ error: 'must be a full URL, e.g. http://localhost:5173' })
    .default('http://localhost:5173'),
  /** Secret mixed into IP hashes so stored hashes can't be reversed by guessing IPs. */
  IP_HASH_PEPPER: z
    .string({ error: 'is required (see server/.env.example for how to generate one)' })
    .min(32, { error: 'must be at least 32 characters (generate a random value)' }),
  /**
   * How many reverse proxies sit in front of the API (0 locally, 1 on Render).
   * Needed so rate limiting sees the visitor's real IP, not the proxy's.
   */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
});

export type Env = z.infer<typeof EnvSchema>;

export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvError';
  }
}

/** Validate a raw environment object. Exported so tests can check the error messages. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new EnvError(
      `Invalid environment configuration:\n${problems}\n` +
        'Fix server/.env (copy it from server/.env.example) and restart.',
    );
  }
  return result.data;
}

// Load server/.env in local development. Hosting providers (Render) set real env vars instead.
// Variables that are already set (e.g. by the test runner) are never overwritten.
const envFile = fileURLToPath(new URL('../../.env', import.meta.url));
if (!process.env.VITEST && existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export const env: Env = parseEnv(process.env);
export const isProduction = env.NODE_ENV === 'production';
