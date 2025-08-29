import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormData, FormSchema } from "../types/form";

interface FormStoreState {
  formData: Partial<FormData>;
  setFormData: (data: Partial<FormData>) => void;
  updateFormField: (fieldId: string, value: unknown) => void;
  clearFormData: () => void;
  setFormDataWithFilter: (data: FormData, schema: FormSchema) => void;
}

export const useFormStore = create<FormStoreState>()(
  persist(
    (set) => ({
      formData: {},

      setFormData: (data) => set({ formData: data }),

      updateFormField: (fieldId, value) =>
        set((state) => ({
          formData: { ...state.formData, [fieldId]: value as FormData[string] },
        })),

      clearFormData: () => {
        set({ formData: {} });
        if (typeof window !== "undefined") {
          localStorage.removeItem("kyc-form-data");
        }
      },
      // filter out file_upload fields because they are not serializable or can be  be stored in local storage
      setFormDataWithFilter: (data, schema) => {
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([key]) => {
            const question = schema.find((q) => q.id === key);
            return question?.type !== "file_upload";
          })
        );
        set({ formData: filteredData });
      },
    }),
    {
      name: "kyc-form-data",
      partialize: (state) => ({ formData: state.formData }),
    }
  )
);
