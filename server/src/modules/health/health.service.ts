import type { HealthStatus } from '@accentra/shared';
import { pingDb } from '../../config/db.js';
import { APP_VERSION } from '../../lib/version.js';

/** The API is "ok" whenever it can answer; the database is reported separately. */
export async function getHealth(): Promise<HealthStatus> {
  const dbUp = await pingDb();
  return {
    status: 'ok',
    db: dbUp ? 'up' : 'down',
    version: APP_VERSION,
    time: new Date().toISOString(),
  };
}
