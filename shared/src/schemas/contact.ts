/**
 * Contact form — ONE schema validates both the React form and POST /api/v1/contact.
 * Error messages are i18n keys (client namespace "validation"), translated on the client.
 */
import { z } from 'zod';

export const CONTACT_ROLES = ['entrepreneur', 'ca', 'other'] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 2000 },
} as const;

/** Empty (after trimming) → "required" only; otherwise length rules apply. */
const trimmed = (min: number, max: number, key: string) =>
  z
    .string({ error: `validation:${key}.required` })
    .trim()
    .min(1, { error: `validation:${key}.required`, abort: true })
    .min(min, { error: `validation:${key}.tooShort` })
    .max(max, { error: `validation:${key}.tooLong` });

export const contactMessageSchema = z.object({
  name: trimmed(CONTACT_LIMITS.name.min, CONTACT_LIMITS.name.max, 'name'),
  email: z
    .string({ error: 'validation:email.required' })
    .trim()
    .toLowerCase()
    .min(1, { error: 'validation:email.required', abort: true })
    .max(CONTACT_LIMITS.email.max, { error: 'validation:email.tooLong' })
    .pipe(z.email({ error: 'validation:email.invalid' })),
  role: z.enum(CONTACT_ROLES, { error: 'validation:role.required' }),
  subject: trimmed(CONTACT_LIMITS.subject.min, CONTACT_LIMITS.subject.max, 'subject'),
  message: trimmed(CONTACT_LIMITS.message.min, CONTACT_LIMITS.message.max, 'message'),
  /** Honeypot: hidden from people, filled by bots. Never shown, never stored. */
  website: z.string().max(500).optional(),
});

/** What the form holds (before trimming / lowercasing). */
export type ContactMessageInput = z.input<typeof contactMessageSchema>;
/** What the server receives after validation. */
export type ContactMessage = z.output<typeof contactMessageSchema>;

export interface ContactMessageCreated {
  id: string;
}
