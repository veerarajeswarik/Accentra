import { describe, expect, it } from 'vitest';
import { contactMessageSchema } from './contact.js';

const valid = {
  name: '  Sample Person ',
  email: 'Sample@Example.COM ',
  role: 'entrepreneur',
  subject: 'Question about CA reviews',
  message: 'How does the clarification step work for my accountant?',
};

describe('contactMessageSchema', () => {
  it('accepts a valid message and normalises it', () => {
    const parsed = contactMessageSchema.parse(valid);
    expect(parsed.name).toBe('Sample Person');
    expect(parsed.email).toBe('sample@example.com');
  });

  it.each([
    [{ email: 'not-an-email' }, 'email', 'validation:email.invalid'],
    [{ message: 'too short' }, 'message', 'validation:message.tooShort'],
    [{ message: 'x'.repeat(2001) }, 'message', 'validation:message.tooLong'],
    [{ name: 'A' }, 'name', 'validation:name.tooShort'],
    [{ role: 'hacker' }, 'role', 'validation:role.required'],
    [{ subject: '   ' }, 'subject', 'validation:subject.tooShort'],
  ])('rejects %j with an i18n key', (patch, path, key) => {
    const result = contactMessageSchema.safeParse({ ...valid, ...patch });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === path);
    expect(issue?.message).toBe(key);
  });

  it('reports a missing field with the "required" key', () => {
    const { email: _omit, ...rest } = valid;
    const result = contactMessageSchema.safeParse(rest);
    expect(result.error?.issues[0]?.message).toBe('validation:email.required');
  });
});
