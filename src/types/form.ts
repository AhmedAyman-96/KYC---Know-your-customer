// ============================================================================
// These schemas were used in the initial implementation but have been replaced
// by the dynamic validation system in utils/validation.ts for better flexibility.
// ============================================================================

/*
export const textQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("text"),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  maxLength: z.number().optional(),
});

export const textareaQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("textarea"),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  maxLength: z.number().optional(),
  rows: z.number().optional(),
});

export const radioButtonsQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("radio_buttons"),
  required: z.boolean().optional(),
  options: z.array(z.string()),
});

export const multiChoiceQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("multi_choice"),
  required: z.boolean().optional(),
  options: z.array(z.string()),
  min: z.number().optional(),
  max: z.number().optional(),
});

export const dropDownQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("drop_down"),
  required: z.boolean().optional(),
  options: z.array(z.string()),
  placeholder: z.string().optional(),
});

export const fileUploadQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("file_upload"),
  required: z.boolean().optional(),
  accept: z.string().optional(),
  maxSize: z.number().optional(),
  multiple: z.boolean().optional(),
});

export const datePickerQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("date_picker"),
  required: z.boolean().optional(),
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  placeholder: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  textQuestionSchema,
  textareaQuestionSchema,
  radioButtonsQuestionSchema,
  multiChoiceQuestionSchema,
  dropDownQuestionSchema,
  fileUploadQuestionSchema,
  datePickerQuestionSchema,
]);

export const formSchemaValidator = z.array(questionSchema);
*/

// ============================================================================
// CURRENT TYPE DEFINITIONS (Used by Dynamic Validation System)
// ============================================================================

export type QuestionType =
  | "text"
  | "textarea"
  | "radio_buttons"
  | "multi_choice"
  | "drop_down"
  | "file_upload"
  | "date_picker"
  | "number";

export interface BaseQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface TextAreaQuestion extends BaseQuestion {
  type: "textarea";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export interface RadioButtonsQuestion extends BaseQuestion {
  type: "radio_buttons";
  options: string[];
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: "multi_choice";
  options: string[];
  min?: number;
  max?: number;
}

export interface DropDownQuestion extends BaseQuestion {
  type: "drop_down";
  options: string[];
  placeholder?: string;
}

export interface FileUploadQuestion extends BaseQuestion {
  type: "file_upload";
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

export interface DatePickerQuestion extends BaseQuestion {
  type: "date_picker";
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export type Question =
  | TextQuestion
  | TextAreaQuestion
  | RadioButtonsQuestion
  | MultiChoiceQuestion
  | DropDownQuestion
  | FileUploadQuestion
  | DatePickerQuestion
  | NumberQuestion;

export type FormSchema = Question[];

export type FormData = Record<
  string,
  string | string[] | File | File[] | number | undefined
>;

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  data?: FormData;
  submissionId?: string;
}

export interface SubmissionLog {
  timestamp: string;
  submissionId: string;
  formData: Record<string, any>;
}
