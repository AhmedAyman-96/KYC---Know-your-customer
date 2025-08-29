import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render, mockUseAppStore } from '../helpers/test-utils';
import App from '../../App';

const mockFetch = vi.fn();

vi.mock('../../services/mockApi', () => ({
    submitKYCForm: vi.fn(),
}));

describe('App Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppStore.isSubmitted = false;
        mockUseAppStore.isDarkMode = false;

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id: "full_name",
                    label: "Full Name",
                    type: "text",
                    required: true
                }
            ]
        });

        Object.defineProperty(window, 'fetch', {
            value: mockFetch,
            writable: true
        });
    });

    it('renders main app layout with header and form', async () => {
        render(<App />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByText(/know your customer form/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/loading form/i)).not.toBeInTheDocument();
        });
    });

    it('renders with semantic landmarks for accessibility', async () => {
        render(<App />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/know your customer form/i);

        await waitFor(() => {
            expect(screen.queryByText(/loading form/i)).not.toBeInTheDocument();
        });
    });

    it('displays form settings', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.queryByText(/loading form/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/multi-step form/i)).toBeInTheDocument();
    });
});
