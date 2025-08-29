import React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { Question, FormData } from "../types/form";
import { getDefaultFormData } from "../utils/validation";

import { TextInput } from "./inputs/TextInput";
import { TextAreaInput } from "./inputs/TextAreaInput";
import { RadioButtonsInput } from "./inputs/RadioButtonsInput";
import { MultiChoiceInput } from "./inputs/MultiChoiceInput";
import { DropDownInput } from "./inputs/DropDownInput";
import { FileUploadInput } from "./inputs/FileUploadInput";
import { DatePickerInput } from "./inputs/DatePickerInput";
import { NumberInput } from "./inputs/NumberInput";

interface FormFieldProps {
  question: Question;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const inputMap: any = {
  text: TextInput,
  textarea: TextAreaInput,
  radio_buttons: RadioButtonsInput,
  multi_choice: MultiChoiceInput,
  drop_down: DropDownInput,
  file_upload: FileUploadInput,
  date_picker: DatePickerInput,
  number: NumberInput,
};



export const FormField: React.FC<FormFieldProps> = ({
  question,
  control,
  errors,
}) => {
  const InputComponent = inputMap[question.type];

  if (!InputComponent) { // fallback if non-handled type
    return (
      <div className="text-red-500 text-sm">
        Unsupported field type: {question.type}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Controller
        name={question.id}
        control={control}
        defaultValue={getDefaultFormData([question])[question.id]}
        render={({ field }) => (
          <InputComponent
            {...field}
            question={question}
            error={errors[question.id]?.message as string | undefined}
          />
        )}
      />
    </div>
  );
};
