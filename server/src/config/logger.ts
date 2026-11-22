/**
 * Application logger (pino). Pretty, coloured output in development; JSON in production.
 * RULE: never log request bodies, passwords, tokens, or cookies.
 */
import { pino } from 'pino';
import { env } from './env.js';

const level = env.NODE_ENV === 'test' ? 'silent' : env.NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = pino({
  level,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    censor: '[redacted]',
  },
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }
    : {}),
});
