import type { ContactMessage } from '@accentra/shared';
import type { Request, Response } from 'express';
import { createContactMessage } from './contact.service.js';

export async function postContactHandler(req: Request, res: Response): Promise<void> {
  // req.body was validated and normalised by validateBody(contactMessageSchema).
  const created = await createContactMessage(req.body as ContactMessage, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  res.status(201).json({ data: created });
}
