import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch for AI chat tests
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

// ─── SMOKE TESTS ─────────────────────────────────────────────────────────────

describe('AetherOS App — Smoke Tests', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(document.getElementById('root') || document.body).toBeTruthy();
  });

  test('shows AetherOS brand in topbar', () => {
    render(<App />);
    expect(screen.getByText(/AETHER/i)).toBeInTheDocument();
  });

  test('renders Overview page by default', () => {
    render(<App />);
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
  });
});

// ─── NAVIGATION TESTS ────────────────────────────────────────────────────────

describe('Navigation', () => {
  test('can navigate to Agents page', () => {
    render(<App />);
    const agentsLink = screen.getAllByText(/Agents/i)[0];
    fireEvent.click(agentsLink);
    expect(screen.getByText(/Workforce/i)).toBeInTheDocument();
  });

  test('can navigate to Projects page', () => {
    render(<App />);
    const projectsLink = screen.getAllByText(/Projects/i)[0];
    fireEvent.click(projectsLink);
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
  });

  test('can navigate to Approvals page', () => {
    render(<App />);
    const approvalsLink = screen.getAllByText(/Approvals/i)[0];
    fireEvent.click(approvalsLink);
    expect(screen.getByText(/Decisions/i)).toBeInTheDocument();
  });

  test('can navigate to Settings page', () => {
    render(<App />);
    const settingsLink = screen.getAllByText(/Settings/i)[0];
    fireEvent.click(settingsLink);
    expect(screen.getByText(/Platform/i)).toBeInTheDocument();
  });
});

// ─── COMMAND PALETTE ─────────────────────────────────────────────────────────

describe('Command Palette', () => {
  test('opens command palette with Ctrl+K', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/Search pages/i)).toBeInTheDocument();
  });

  test('closes command palette with Escape', async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search pages/i)).not.toBeInTheDocument();
    });
  });
});

// ─── APPROVALS FLOW ──────────────────────────────────────────────────────────

describe('Approvals Flow', () => {
  test('can approve an item', async () => {
    render(<App />);
    // Navigate to approvals
    const approvalsLink = screen.getAllByText(/Approvals/i)[0];
    fireEvent.click(approvalsLink);

    // Find approve buttons
    const approveButtons = screen.getAllByText(/✓ Approve/i);
    expect(approveButtons.length).toBeGreaterThan(0);

    // Click first approve
    fireEvent.click(approveButtons[0]);

    // Should show one less approval
    await waitFor(() => {
      const remaining = screen.queryAllByText(/✓ Approve/i);
      expect(remaining.length).toBeLessThan(approveButtons.length);
    });
  });
});

// ─── SETTINGS FLOW ───────────────────────────────────────────────────────────

describe('Settings Flow', () => {
  test('Save Changes button is disabled when no changes made', () => {
    render(<App />);
    const settingsLink = screen.getAllByText(/Settings/i)[0];
    fireEvent.click(settingsLink);

    const saveBtn = screen.getByText(/Saved ✓/i);
    expect(saveBtn).toBeDisabled();
  });
});

// ─── ACCESSIBILITY ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('topbar has no empty interactive elements', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // Each button should have accessible text or aria-label
      const hasText = button.textContent.trim().length > 0;
      const hasLabel = button.getAttribute('aria-label');
      expect(hasText || hasLabel).toBeTruthy();
    });
  });
});
