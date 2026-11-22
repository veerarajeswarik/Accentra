import { describe, expect, it, vi } from 'vitest';
import { ApiError, apiClient, parseResponse } from './apiClient';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('apiClient error parsing', () => {
  it('turns the server error envelope into a typed ApiError', async () => {
    const response = jsonResponse(400, {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Some fields are invalid',
        details: [{ path: 'amountPaise', message: 'Expected integer' }],
      },
    });

    const error = await parseResponse(response).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Some fields are invalid',
      details: [{ path: 'amountPaise', message: 'Expected integer' }],
    });
  });

  it('handles non-JSON error responses (e.g. a proxy HTML page)', async () => {
    const response = new Response('<html>Bad Gateway</html>', { status: 502 });

    await expect(parseResponse(response)).rejects.toMatchObject({
      status: 502,
      code: 'BAD_RESPONSE',
    });
  });

  it('handles JSON error responses that are not in the envelope shape', async () => {
    await expect(parseResponse(jsonResponse(500, { oops: true }))).rejects.toMatchObject({
      status: 500,
      code: 'BAD_RESPONSE',
    });
  });

  it('returns the success envelope', async () => {
    const result = await parseResponse<{ ok: boolean }>(jsonResponse(200, { data: { ok: true } }));
    expect(result).toEqual({ data: { ok: true } });
  });

  it('reports network failures as NETWORK_ERROR', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiClient.get('/health')).rejects.toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    });
  });

  it('calls same-origin /api/v1 with cookies and JSON headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, { data: { id: '1' } }));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.post('/things', { name: 'x' });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/things',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: '{"name":"x"}',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }) as unknown,
      }),
    );
  });
});
