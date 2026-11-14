import { afterEach, describe, expect, it, vi } from 'vitest';
import chatHandler from '../../api/chat';
import analyzeHandler from '../../api/analyze';
import { MAX_REQUEST_BYTES } from '../../server/gemini';

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe('Vercel Gemini API request guards', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('rejects oversized requests before calling Gemini', async () => {
    const request = {
      method: 'POST',
      headers: { 'content-length': String(MAX_REQUEST_BYTES + 1) },
      body: { message: 'Hello' },
    };
    const response = createResponse();

    await chatHandler(request, response);

    expect(response.statusCode).toBe(413);
    expect(response.body.error).toBe('Request body is too large');
  });

  it('rejects non-POST requests', async () => {
    const response = createResponse();

    await analyzeHandler({ method: 'GET', headers: {}, body: {} }, response);

    expect(response.statusCode).toBe(405);
    expect(response.headers.Allow).toBe('POST');
  });

  it('returns a validation error for empty chat input', async () => {
    const response = createResponse();

    await chatHandler({ method: 'POST', headers: {}, body: {} }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('A message is required');
  });
});
