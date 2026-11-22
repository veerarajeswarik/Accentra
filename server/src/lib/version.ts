import { readFileSync } from 'node:fs';

/** The server's version from server/package.json (same relative path from src/ and dist/). */
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string;
};

export const APP_VERSION = pkg.version;
