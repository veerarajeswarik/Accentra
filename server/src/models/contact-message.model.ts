/**
 * Messages from the public /contact form. Generic on purpose: the admin support inbox
 * (Phase 25) reads and updates these.
 */
import { CONTACT_ROLES } from '@accentra/shared';
import { Schema, model, type InferSchemaType } from 'mongoose';

export const CONTACT_STATUSES = ['new', 'handled'] as const;

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    role: { type: String, required: true, enum: CONTACT_ROLES },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 2000 },
    /** HMAC-SHA256 of the sender's IP with IP_HASH_PEPPER — never the raw IP. */
    ipHash: { type: String, required: true },
    userAgent: { type: String, maxlength: 300 },
    status: { type: String, enum: CONTACT_STATUSES, default: 'new' },
  },
  { timestamps: true, collection: 'contactMessages' },
);

contactMessageSchema.index({ createdAt: -1 });

export type ContactMessageDoc = InferSchemaType<typeof contactMessageSchema>;

export const ContactMessageModel = model('ContactMessage', contactMessageSchema);
