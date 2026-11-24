import { describe, expect, it } from 'vitest';
import { EnvError, parseEnv } from './env.js';

const PEPPER = 'x'.repeat(32);

describe('parseEnv', () => {
  it('applies defaults', () => {
    const env = parseEnv({
      MONGODB_URI: 'mongodb://localhost:27017/accentra_dev',
      IP_HASH_PEPPER: PEPPER,
    });
    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 5000,
      MONGODB_URI: 'mongodb://localhost:27017/accentra_dev',
      CLIENT_ORIGIN: 'http://localhost:5173',
      IP_HASH_PEPPER: PEPPER,
      TRUST_PROXY: 0,
    });
  });

  it('lists every missing or invalid variable', () => {
    let caught: unknown;
    try {
      parseEnv({ NODE_ENV: 'staging', PORT: 'abc', CLIENT_ORIGIN: 'not a url', TRUST_PROXY: '-1' });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(EnvError);
    const message = (caught as Error).message;
    for (const name of [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI',
      'CLIENT_ORIGIN',
      'IP_HASH_PEPPER',
      'TRUST_PROXY',
    ]) {
      expect(message).toContain(name);
    }
    expect(message).toContain('server/.env.example');
  });

  it('rejects a MongoDB URI with the wrong scheme', () => {
    expect(() =>
      parseEnv({ MONGODB_URI: 'http://cluster0.mongodb.net', IP_HASH_PEPPER: PEPPER }),
    ).toThrow(/mongodb:\/\/ or mongodb\+srv:\/\//);
  });

  it('rejects an empty or short IP_HASH_PEPPER', () => {
    const uri = 'mongodb://localhost:27017/x';
    expect(() => parseEnv({ MONGODB_URI: uri, IP_HASH_PEPPER: '' })).toThrow(/IP_HASH_PEPPER/);
    expect(() => parseEnv({ MONGODB_URI: uri, IP_HASH_PEPPER: 'short' })).toThrow(/at least 32/);
  });
});
