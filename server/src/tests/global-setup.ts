/**
 * Starts ONE in-memory MongoDB *replica set* for the whole test run.
 * A replica set (not a standalone server) is required for MongoDB transactions,
 * which the ledger uses from Phase 6 onward.
 */
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import type { TestProject } from 'vitest/node';

let replSet: MongoMemoryReplSet | undefined;

export async function setup(project: TestProject): Promise<void> {
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
