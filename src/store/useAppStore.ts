import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormSchema } from "../types/form";

interface AppState {
  // Theme state
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Dev mode state
  isDevMode: boolean;
  toggleDevMode: () => void;

  // Schema state
  currentSchema: FormSchema | null;
  setCurrentSchema: (schema: FormSchema) => void;
  clearCurrentSchema: () => void;
  isCustomSchema: boolean;
  setIsCustomSchema: (isCustom: boolean) => void;

  // Form state
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;

  // Form submission state
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;

  // Multi-step form state
  isMultiStep: boolean;
  setIsMultiStep: (multiStep: boolean) => void;
  questionsPerStep: number;
  setQuestionsPerStep: (count: number) => void;

  // Track if user has progressed past step 1
  hasProgressedPastStep1: boolean;
  setHasProgressedPastStep1: (progressed: boolean) => void;

  // Reset form
  resetForm: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme state
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Dev mode state
      isDevMode: false,
      toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),

      // Schema state
      currentSchema: null,
      setCurrentSchema: (schema) => set({ currentSchema: schema }),
      clearCurrentSchema: () => set({ currentSchema: null }),
      isCustomSchema: false,
      setIsCustomSchema: (isCustom) => set({ isCustomSchema: isCustom }),

      // Form state
      currentStep: 1,
      totalSteps: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      setTotalSteps: (total) => set({ totalSteps: total }),

      // Form submission state
      isSubmitting: false,
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

      // Multi-step form state
      isMultiStep: false,
      setIsMultiStep: (multiStep) => set({ isMultiStep: multiStep }),
      questionsPerStep: 3,
      setQuestionsPerStep: (count) => set({ questionsPerStep: count }),

      // Track if user has progressed past step 1
      hasProgressedPastStep1: false,
      setHasProgressedPastStep1: (progressed) =>
        set({ hasProgressedPastStep1: progressed }),

      // Reset form
      resetForm: () =>
        set({
          currentStep: 1,
          isSubmitting: false,
          hasProgressedPastStep1: false,
        }),
    }),
    {
      name: "kyc-form-storage",
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isDevMode: state.isDevMode,
        currentSchema: state.currentSchema,
        currentStep: state.currentStep,
      }),
    }
  )
);
