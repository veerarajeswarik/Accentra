/**
 * Entry point: starts the HTTP server, then connects to MongoDB in the background.
 * The API starts even if the database is unreachable, so /health can report db "down"
 * instead of the process crashing with no message.
 */
import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Accentra API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.fatal(`Port ${env.PORT} is already in use. Stop the other process or change PORT.`);
  } else {
    logger.fatal({ err }, 'HTTP server error');
  }
  process.exit(1);
});

connectDb().catch((err: unknown) => {
  logger.fatal({ err }, 'Could not connect to MongoDB');
});

let shuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received, shutting down gracefully`);

  const forceExit = setTimeout(() => {
    logger.error('Shutdown took too long, forcing exit');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(() => {
    disconnectDb()
      .then(() => {
        logger.info('Shutdown complete');
        process.exit(0);
      })
      .catch((err: unknown) => {
        logger.error({ err }, 'Error while closing MongoDB connection');
        process.exit(1);
      });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
