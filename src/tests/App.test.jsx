import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../utils/demoState', () => ({
  useDemoState: () => [{ phase: 'Pre-Match', isEmergency: false }, vi.fn()],
  getDemoState: vi.fn(),
  demoStateSubscribers: new Set(),
  notifySubscribers: vi.fn(),
  updateDemoState: vi.fn(),
}));

describe('App Component', () => {
  it('renders the header correctly', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Smart Stadium AI')).toBeInTheDocument();
  });

  it('renders the main navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Entry')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
