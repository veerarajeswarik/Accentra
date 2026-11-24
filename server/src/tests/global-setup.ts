/**
 * Starts ONE in-memory MongoDB *replica set* for the whole test run.
 * A replica set (not a standalone server) is required for MongoDB transactions,
 * which the ledger uses from Phase 6 onward.
 */
import { fileURLToPath } from 'node:url';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import type { TestProject } from 'vitest/node';

let replSet: MongoMemoryReplSet | undefined;

/**
 * Pin the mongod binary cache to <repo>/node_modules/.cache/mongodb-memory-server.
 * Otherwise the location depends on where tests are started from, and a different
 * folder means re-downloading a ~780 MB archive.
 */
const BINARY_CACHE = fileURLToPath(
  new URL('../../../node_modules/.cache/mongodb-memory-server', import.meta.url),
);

export async function setup(project: TestProject): Promise<void> {
  process.env.MONGOMS_DOWNLOAD_DIR ??= BINARY_CACHE;
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  project.provide('mongoUri', replSet.getUri('accentra_test'));
}

export async function teardown(): Promise<void> {
  await replSet?.stop();
}

declare module 'vitest' {
  export interface ProvidedContext {
    mongoUri: string;
  }
}
