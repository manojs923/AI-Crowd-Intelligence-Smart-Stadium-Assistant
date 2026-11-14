import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAssistantReply, sanitizeInput } from '../utils/chat';
import crowdZones from '../data/crowdData.json';
import stalls from '../data/stallsData.json';

describe("Chat Sanitization", () => {
  it("removes script tags", () => {
    const input = "<script>alert(1)</script>";
    const output = sanitizeInput(input);
    expect(output).not.toContain('<');
  });

  it("keeps normal text", () => {
    const input = "Hello stadium";
    const output = sanitizeInput(input);
    expect(output).toBe("Hello stadium");
  });

  it('uses local routing guidance when the assistant API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const reply = await getAssistantReply(
      'Where is the exit?',
      crowdZones,
      stalls,
      'First Half',
      { gate: 'South Gate', accessibleMode: true },
    );

    expect(reply).toContain('Best exit right now is');
    expect(reply).toContain('South Gate');
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
