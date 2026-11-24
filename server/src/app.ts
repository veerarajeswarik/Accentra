/**
 * Builds the Express app (without starting it), so tests can use it with Supertest.
 * Middleware order matters: ids/logging → security → parsing → routes → 404 → errors.
 */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env, isProduction } from './config/env.js';
import { logger } from './config/logger.js';
import { createErrorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { requestId } from './middleware/request-id.js';
import { createApiRouter } from './routes.js';

export function createApp(): Express {
  const app = express();
  // Behind Render/Vercel the visitor IP arrives in X-Forwarded-For; trust exactly N proxies.
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.id,
      // Log method, url, status and timing only; never request bodies.
      serializers: {
        req: (req: { id: unknown; method: string; url: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
      },
    }),
  );
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use('/api/v1', createApiRouter());

  app.use(notFound);
  app.use(createErrorHandler({ isProduction }));

  return app;
}
