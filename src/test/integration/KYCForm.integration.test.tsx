import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../helpers/test-utils';
import { KYCForm } from '../../components/KYCForm';
import { testSchema, simpleSchema } from '../helpers/mock-data';

const mockSubmitKYCForm = vi.fn();
vi.mock('../../services/mockApi', () => ({
    submitKYCForm: mockSubmitKYCForm,
}));

describe('KYC Form - Core User Experience', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockSubmitKYCForm.mockResolvedValue({ success: true, submissionId: 'test-123' });
    });

    describe('Form Display and Basic Interaction', () => {
        it('displays form fields and allows user to fill them out', () => {
            render(<KYCForm schema={testSchema} onSubmit={mockOnSubmit} />);

            expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
            expect(screen.getByText(/gender/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        });

        it('shows form settings panel', () => {
            render(<KYCForm schema={testSchema} onSubmit={mockOnSubmit} />);

            expect(screen.getByText(/multi-step form/i)).toBeInTheDocument();
        });
    });

    describe('Successful Form Completion', () => {
        it('allows user to complete and submit a valid form', async () => {
            const { user } = render(<KYCForm schema={simpleSchema} onSubmit={mockOnSubmit} />);

            await user.type(screen.getByLabelText(/name/i), 'Ahmed Ayman');
            await user.type(screen.getByLabelText(/email/i), 'ahmed@example.com');

            const submitButton = screen.getByRole('button', { name: /submit/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith({
                    name: 'Ahmed Ayman',
                    email: 'ahmed@example.com',
                });
            });
        });

        it('provides visual feedback during form submission', async () => {
            mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

            const { user } = render(<KYCForm schema={simpleSchema} onSubmit={mockOnSubmit} />);

            await user.type(screen.getByLabelText(/name/i), 'Ahmed Ayman');
            await user.type(screen.getByLabelText(/email/i), 'ahmed@example.com');

            const submitButton = screen.getByRole('button', { name: /submit/i });
            await user.click(submitButton);

            expect(screen.getByText(/submitting.../i)).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });
    });

});
