import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../utils/demoState', () => ({
  useDemoState: () => [{ phase: 'Pre-Match', isEmergency: false }, vi.fn()],
}));

const mockUserProfile = {
  gate: 'North Gate',
  seat: 'Section 104',
  goal: 'food',
};

describe('Dashboard Component', () => {
  it('renders phase information and user profile', () => {
    render(
      <Dashboard userProfile={mockUserProfile} onResetExperience={vi.fn()} />
    );
    expect(screen.getByText(/Pre-Match/i)).toBeInTheDocument();
    expect(screen.getAllByText(/North Gate.*Section 104/i).length).toBeGreaterThan(0);
  });

  it('renders action cards and navigation button', () => {
    render(
      <Dashboard userProfile={mockUserProfile} onResetExperience={vi.fn()} />
    );
    expect(screen.getByText(/Follow Route/i)).toBeInTheDocument();
  });

  it('toggles accessible mode', () => {
    render(
      <Dashboard userProfile={mockUserProfile} onResetExperience={vi.fn()} />
    );
    const button = screen.getByRole("button", { name: /accessible mode/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
