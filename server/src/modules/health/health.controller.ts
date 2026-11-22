import type { Request, Response } from 'express';
import { getHealth } from './health.service.js';

export async function getHealthHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await getHealth() });
}
