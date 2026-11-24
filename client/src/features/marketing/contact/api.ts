import type { ContactMessageCreated, ContactMessageInput } from '@accentra/shared';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';

/** POST /api/v1/contact */
export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (input: ContactMessageInput) =>
      (await apiClient.post<ContactMessageCreated>('/contact', input)).data,
  });
}
