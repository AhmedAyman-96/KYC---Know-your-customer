import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockUseAppStore = {
    isDarkMode: false,
    isDevMode: true,
    isSubmitted: false,
    isMultiStep: false,
    questionsPerStep: 3,
    currentStep: 1,
    totalSteps: 1,
    currentSchema: null,
    isSubmitting: false,
    toggleTheme: vi.fn(),
    toggleDevMode: vi.fn(),
    setIsSubmitted: vi.fn(),
    setIsMultiStep: vi.fn(),
    setQuestionsPerStep: vi.fn(),
    setCurrentStep: vi.fn(),
    setTotalSteps: vi.fn(),
    setCurrentSchema: vi.fn(),
    clearCurrentSchema: vi.fn(),
    setIsSubmitting: vi.fn(),
    resetForm: vi.fn(),
};

const mockUseFormStore = {
    formData: {},
    setFormData: vi.fn(),
    clearFormData: vi.fn(),
    setFormDataWithFilter: vi.fn(),
};

vi.mock('../store/useAppStore', () => ({
    useAppStore: () => mockUseAppStore,
}));

vi.mock('../store/useFormStore', () => ({
    useFormStore: () => mockUseFormStore,
}));

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    return {
        user: userEvent.setup(),
        ...render(ui, options),
    };
};

export { screen, waitFor, fireEvent } from '@testing-library/react';
export { customRender as render };
export { mockUseAppStore, mockUseFormStore };
