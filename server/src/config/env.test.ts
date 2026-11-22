import { describe, expect, it } from 'vitest';
import { EnvError, parseEnv } from './env.js';

describe('parseEnv', () => {
  it('applies defaults', () => {
    const env = parseEnv({ MONGODB_URI: 'mongodb://localhost:27017/accentra_dev' });
    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 5000,
      MONGODB_URI: 'mongodb://localhost:27017/accentra_dev',
      CLIENT_ORIGIN: 'http://localhost:5173',
    });
  });

  it('lists every missing or invalid variable', () => {
    let caught: unknown;
    try {
      parseEnv({ NODE_ENV: 'staging', PORT: 'abc', CLIENT_ORIGIN: 'not a url' });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(EnvError);
    const message = (caught as Error).message;
    expect(message).toContain('NODE_ENV');
    expect(message).toContain('PORT');
    expect(message).toContain('MONGODB_URI');
    expect(message).toContain('CLIENT_ORIGIN');
    expect(message).toContain('server/.env.example');
  });

  it('rejects a MongoDB URI with the wrong scheme', () => {
    expect(() => parseEnv({ MONGODB_URI: 'http://cluster0.mongodb.net' })).toThrow(
      /mongodb:\/\/ or mongodb\+srv:\/\//,
    );
  });
});
