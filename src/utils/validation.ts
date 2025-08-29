import { z } from "zod";
import type { FormSchema, FormData, Question } from "../types/form";

export const createValidationSchema = (formSchema: FormSchema) => {
  const schemaObject: Record<string, any> = {};

  formSchema.forEach((question: Question) => {
    switch (question.type) {
      case "text":
      case "textarea": {
        let textSchema = z.string();

        if (question.required) {
          textSchema = textSchema.min(1, `${question.label} is required`);
        }

        if (question.minLength) {
          textSchema = textSchema.min(
            question.minLength,
            `${question.label} must be at least ${question.minLength} characters`
          );
        }

        if (question.maxLength) {
          textSchema = textSchema.max(
            question.maxLength,
            `${question.label} must be less than ${question.maxLength} characters`
          );
        }

        if (question.id.toLowerCase().includes("email")) {
          textSchema = textSchema.email("Please enter a valid email address");
        }

        if (!question.required) {
          schemaObject[question.id] = textSchema.optional();
        } else {
          schemaObject[question.id] = textSchema;
        }
        break;
      }

      case "number": {
        let numberSchema = z.number();

        if (question.required) {
          numberSchema = numberSchema.min(1, `${question.label} is required`);
        }

        if (question.min !== undefined) {
          numberSchema = numberSchema.min(
            question.min,
            `${question.label} must be at least ${question.min}`
          );
        }

        if (question.max !== undefined) {
          numberSchema = numberSchema.max(
            question.max,
            `${question.label} must be no more than ${question.max}`
          );
        }

        if (!question.required) {
          schemaObject[question.id] = numberSchema.optional();
        } else {
          schemaObject[question.id] = numberSchema;
        }
        break;
      }

      case "radio_buttons":
      case "drop_down": {
        let selectSchema = z.string();

        if (question.required) {
          selectSchema = selectSchema.min(1, `${question.label} is required`);
          schemaObject[question.id] = selectSchema;
        } else {
          schemaObject[question.id] = selectSchema.optional();
        }
        break;
      }

      case "multi_choice": {
        let arraySchema = z.array(z.string());

        if (question.required || question.min) {
          const minRequired = question.min || 1;
          arraySchema = arraySchema.min(
            minRequired,
            `Please select at least ${minRequired} option(s) for ${question.label}`
          );
        }

        if (question.max) {
          arraySchema = arraySchema.max(
            question.max,
            `Please select no more than ${question.max} option(s) for ${question.label}`
          );
        }

        if (!question.required && !question.min) {
          schemaObject[question.id] = arraySchema.optional();
        } else {
          schemaObject[question.id] = arraySchema;
        }
        break;
      }

      case "file_upload": {
        if (question.multiple) {
          // added z.null(), z.undefined() because zod was not accepting empty file field and fails to validate
          const multiFileSchema = z
            .union([z.array(z.instanceof(File)), z.null(), z.undefined()])
            .refine(
              (val) => {
                if (question.required) {
                  return val && Array.isArray(val) && val.length > 0;
                }
                return true;
              },
              question.required ? `${question.label} is required` : undefined
            );

          schemaObject[question.id] = multiFileSchema;
        } else {
          const singleFileSchema = z
            .union([z.instanceof(File), z.null(), z.undefined()])
            .refine(
              (val) => {
                if (question.required) {
                  return val instanceof File;
                }
                return true;
              },
              question.required ? `${question.label} is required` : undefined
            );

          schemaObject[question.id] = singleFileSchema;
        }
        break;
      }

      case "date_picker": {
        let dateSchema = z.string();

        if (question.required) {
          dateSchema = dateSchema.min(1, `${question.label} is required`);
        }

        // Date format validation (YYYY-MM-DD from date picker)
        dateSchema = dateSchema.refine((date) => {
          if (!date) return !question.required;
          return /^\d{4}-\d{2}-\d{2}$/.test(date);
        }, "Please enter a valid date");

        if (question.minDate) {
          dateSchema = dateSchema.refine((date) => {
            if (!date) return !question.required;
            const minDateValue =
              question.minDate === "today"
                ? new Date().toISOString().split("T")[0]
                : question.minDate!;
            return date >= minDateValue;
          }, `Date must be after ${question.minDate === "today" ? "today" : question.minDate}`);
        }

        if (question.maxDate) {
          dateSchema = dateSchema.refine((date) => {
            if (!date) return !question.required;
            const maxDateValue =
              question.maxDate === "today"
                ? new Date().toISOString().split("T")[0]
                : question.maxDate!;
            return date <= maxDateValue;
          }, `Date must be before ${question.maxDate === "today" ? "today" : question.maxDate}`);
        }

        if (!question.required) {
          schemaObject[question.id] = dateSchema.optional();
        } else {
          schemaObject[question.id] = dateSchema;
        }
        break;
      }
    }
  });

  return z.object(schemaObject);
};

export const getDefaultFormData = (formSchema: FormSchema): FormData => {
  const defaultData: FormData = {};

  formSchema.forEach((question) => {
    switch (question.type) {
      case "text":
      case "textarea":
      case "radio_buttons":
      case "drop_down":
      case "date_picker":
        defaultData[question.id] = "";
        break;
      case "number":
        defaultData[question.id] = undefined;
        break;
      case "multi_choice":
        defaultData[question.id] = [];
        break;
      case "file_upload":
        defaultData[question.id] = question.multiple
          ? ([] as File[])
          : undefined;
        break;
    }
  });

  return defaultData;
};
