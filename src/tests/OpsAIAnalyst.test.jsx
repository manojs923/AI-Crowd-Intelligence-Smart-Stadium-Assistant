import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OpsAIAnalyst from '../components/OpsAIAnalyst';

describe('Operations AI fallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows a local assessment if the assistant API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <OpsAIAnalyst
        phase="First Half"
        isEmergency={false}
        emergencyType=""
        crowdZones={[
          { zone: 'North Gate', people: 80 },
          { zone: 'West Concourse', people: 10 },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Local assessment; AI is unavailable/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Monitor congestion near North Gate/)).toBeInTheDocument();
  });
});
