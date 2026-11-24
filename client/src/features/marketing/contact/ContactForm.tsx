import {
  CONTACT_LIMITS,
  CONTACT_ROLES,
  contactMessageSchema,
  type ContactMessage,
  type ContactMessageInput,
} from '@accentra/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import { ApiError } from '../../../lib/apiClient';
import { useSendContactMessage } from './api';

const EMPTY: ContactMessageInput = {
  name: '',
  email: '',
  role: undefined as unknown as ContactMessageInput['role'],
  subject: '',
  message: '',
  website: '',
};

const FIELDS: readonly FieldPath<ContactMessageInput>[] = [
  'name',
  'email',
  'role',
  'subject',
  'message',
];

function isFieldIssue(value: unknown): value is { path: string; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { path?: unknown }).path === 'string' &&
    typeof (value as { message?: unknown }).message === 'string'
  );
}

/**
 * Contact form. Validation uses the SAME Zod schema as the server; error messages are
 * i18n keys ("validation:…") translated here. Server field errors are mapped back onto fields.
 */
export function ContactForm() {
  const { t } = useTranslation(['marketing', 'validation']);
  const { toast } = useToast();
  const send = useSendContactMessage();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactMessageInput, unknown, ContactMessage>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: EMPTY,
    mode: 'onTouched',
  });
  // useWatch (not watch()) re-renders only this value and works with React's compiler.
  const messageValue = useWatch({ control, name: 'message' });

  const errorText = (name: keyof ContactMessageInput) => {
    const key = errors[name]?.message;
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await send.mutateAsync(values);
      setSentTo(values.email);
      reset(EMPTY);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VALIDATION_ERROR' && error.details) {
        for (const issue of error.details.filter(isFieldIssue)) {
          const field = issue.path as FieldPath<ContactMessageInput>;
          if (FIELDS.includes(field)) setError(field, { message: issue.message });
        }
        return;
      }
      toast({
        variant: 'error',
        title: t('marketing:contact.errors.toastTitle'),
        description:
          error instanceof ApiError && error.code === 'RATE_LIMITED'
            ? t('marketing:contact.errors.rateLimited')
            : t('marketing:contact.errors.generic'),
      });
    }
  });

  if (sentTo) {
    return (
      <Card>
        <CardBody className="flex flex-col items-start gap-4 p-6" role="status">
          <CheckCircle2 aria-hidden className="size-8 text-success" />
          <h2 className="text-h2">{t('marketing:contact.success.title')}</h2>
          <p className="text-body-lg text-muted">
            {t('marketing:contact.success.body', { email: sentTo })}
          </p>
          <Button variant="secondary" onClick={() => setSentTo(null)}>
            {t('marketing:contact.success.another')}
          </Button>
        </CardBody>
      </Card>
    );
  }

  const messageLength = messageValue?.length ?? 0;
  const requiredText = t('marketing:contact.form.required');

  return (
    <Card>
      <CardBody className="p-6">
        <form noValidate onSubmit={(e) => void onSubmit(e)} className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t('marketing:contact.form.name')}
            error={errorText('name')}
            required
            requiredText={requiredText}
          >
            {(p) => <Input {...p} {...register('name')} autoComplete="name" />}
          </FormField>

          <FormField
            label={t('marketing:contact.form.email')}
            error={errorText('email')}
            required
            requiredText={requiredText}
          >
            {(p) => <Input {...p} {...register('email')} type="email" autoComplete="email" />}
          </FormField>

          <FormField
            label={t('marketing:contact.form.role')}
            error={errorText('role')}
            required
            requiredText={requiredText}
          >
            {(p) => (
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    {...p}
                    name={field.name}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      field.onBlur();
                    }}
                    placeholder={t('marketing:contact.form.rolePlaceholder')}
                    options={CONTACT_ROLES.map((role) => ({
                      value: role,
                      label: t(`marketing:contact.form.roles.${role}`),
                    }))}
                  />
                )}
              />
            )}
          </FormField>

          <FormField
            label={t('marketing:contact.form.subject')}
            error={errorText('subject')}
            required
            requiredText={requiredText}
          >
            {(p) => <Input {...p} {...register('subject')} />}
          </FormField>

          <FormField
            className="sm:col-span-2"
            label={t('marketing:contact.form.message')}
            error={errorText('message')}
            helper={t('marketing:contact.form.messageHelp', {
              count: messageLength,
              max: CONTACT_LIMITS.message.max,
            })}
            required
            requiredText={requiredText}
          >
            {(p) => <Textarea {...p} {...register('message')} rows={6} />}
          </FormField>

          {/* Honeypot: invisible to people and screen readers; bots fill it in. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">{t('marketing:contact.form.website')}</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('website')}
            />
          </div>

          <div className="flex flex-col-reverse items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-small font-normal text-muted">
              <Link to="/privacy" className="text-primary hover:underline">
                {t('marketing:contact.privacyNote')}
              </Link>
            </p>
            <Button type="submit" size="lg" loading={send.isPending} leftIcon={<Send />}>
              {t('marketing:contact.form.submit')}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
