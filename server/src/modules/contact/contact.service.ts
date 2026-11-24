import type { ContactMessage, ContactMessageCreated } from '@accentra/shared';
import { Types } from 'mongoose';
import { logger } from '../../config/logger.js';
import { hashIp } from '../../lib/hash-ip.js';
import { ContactMessageModel } from '../../models/contact-message.model.js';

export interface RequestMeta {
  ip: string | undefined;
  userAgent: string | undefined;
}

/**
 * Store a contact message. If the honeypot field is filled (a bot), pretend success
 * without storing anything, so the bot learns nothing.
 * Never logs names, emails or message content.
 */
export async function createContactMessage(
  input: ContactMessage,
  meta: RequestMeta,
): Promise<ContactMessageCreated> {
  if (input.website && input.website.trim() !== '') {
    logger.info('Contact form honeypot triggered; message discarded');
    return { id: new Types.ObjectId().toHexString() };
  }

  const doc = await ContactMessageModel.create({
    name: input.name,
    email: input.email,
    role: input.role,
    subject: input.subject,
    message: input.message,
    ipHash: hashIp(meta.ip),
    userAgent: meta.userAgent?.slice(0, 300),
  });

  logger.info({ contactMessageId: doc.id }, 'Contact message stored');
  return { id: doc.id };
}
