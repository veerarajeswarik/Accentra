/**
 * Runs in each test worker BEFORE any test file is imported, so that
 * src/config/env.ts sees a valid MONGODB_URI pointing at the in-memory replica set.
 */
import { inject } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = inject('mongoUri');
// Test-only value (not a real secret).
process.env.IP_HASH_PEPPER = 'test-pepper-0123456789abcdefghijklmnopqrstuvwxyz';
