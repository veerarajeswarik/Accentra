import { createHmac } from 'node:crypto';
import { env } from '../config/env.js';

/**
 * One-way, keyed hash of an IP address. Lets us spot abuse from the same source
 * without ever storing the raw IP (personal data under the DPDP Act).
 */
export function hashIp(ip: string | undefined, pepper: string = env.IP_HASH_PEPPER): string {
  return createHmac('sha256', pepper)
    .update(ip ?? 'unknown')
    .digest('hex');
}
