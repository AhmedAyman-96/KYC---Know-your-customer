import type { FormSchema } from "../types/form";

export interface SchemaLoadResult {
  success: boolean;
  schema?: FormSchema;
  error?: string;
}

export class SchemaLoader {
  static async loadFromFile(file: File): Promise<SchemaLoadResult> {
    try {
      const text = await file.text();
      const schema = JSON.parse(text);

      const validation = this.validateSchema(schema);

      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid schema: ${validation.errors.join(", ")}`,
        };
      }

      return { success: true, schema: schema as FormSchema };
    } catch (error) {
      return {
        success: false,
        error: `Failed to load schema: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  static validateSchema(schema: FormSchema): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!Array.isArray(schema)) {
      errors.push("Schema must be an array");
      return { isValid: false, errors };
    }

    if (schema.length === 0) {
      errors.push("Schema cannot be empty");
      return { isValid: false, errors };
    }

    const validTypes = [
      "text",
      "textarea",
      "radio_buttons",
      "multi_choice",
      "drop_down",
      "file_upload",
      "date_picker",
      "number",
    ];

    schema.forEach((question, index) => {
      // Validate mandatory props
      if (!question.id) {
        errors.push(`Question ${index + 1}: Missing 'id' field`);
      } else if (typeof question.id !== "string") {
        errors.push(`Question ${index + 1}: 'id' must be a string`);
      }

      if (!question.label) {
        errors.push(`Question ${index + 1}: Missing 'label' field`);
      } else if (typeof question.label !== "string") {
        errors.push(`Question ${index + 1}: 'label' must be a string`);
      }

      if (!question.type) {
        errors.push(`Question ${index + 1}: Missing 'type' field`);
      } else if (!validTypes.includes(question.type)) {
        errors.push(
          `Question ${
            index + 1
          }: Invalid 'type' field. Must be one of: ${validTypes.join(", ")}`
        );
      }

      // Validate required prop
      if (question.required && typeof question.required !== "boolean") {
        errors.push(`Question ${index + 1}: 'required' must be a boolean`);
      }

      // Validate text questions props
      if (question.type === "text" || question.type === "textarea") {
        if (question.placeholder && typeof question.placeholder !== "string") {
          errors.push(`Question ${index + 1}: 'placeholder' must be a string`);
        }
        if (question.minLength && typeof question.minLength !== "number") {
          errors.push(`Question ${index + 1}: 'minLength' must be a number`);
        }
        if (question.maxLength && typeof question.maxLength !== "number") {
          errors.push(`Question ${index + 1}: 'maxLength' must be a number`);
        }
        if (
          question.minLength &&
          question.maxLength &&
          question.minLength > question.maxLength
        ) {
          errors.push(
            `Question ${
              index + 1
            }: 'minLength' cannot be greater than 'maxLength'`
          );
        }
        if (
          question.type === "textarea" &&
          question.rows &&
          typeof question.rows !== "number"
        ) {
          errors.push(`Question ${index + 1}: 'rows' must be a number`);
        }
      }

      // Validate number question props
      if (question.type === "number") {
        if (question.placeholder && typeof question.placeholder !== "string") {
          errors.push(`Question ${index + 1}: 'placeholder' must be a string`);
        }
        if (question.min !== undefined && typeof question.min !== "number") {
          errors.push(`Question ${index + 1}: 'min' must be a number`);
        }
        if (question.max !== undefined && typeof question.max !== "number") {
          errors.push(`Question ${index + 1}: 'max' must be a number`);
        }
        if (question.step !== undefined && typeof question.step !== "number") {
          errors.push(`Question ${index + 1}: 'step' must be a number`);
        }
        if (
          question.min !== undefined &&
          question.max !== undefined &&
          question.min > question.max
        ) {
          errors.push(
            `Question ${index + 1}: 'min' cannot be greater than 'max'`
          );
        }
      }

      // Validate multi options questions props

      if (
        question.type === "radio_buttons" ||
        question.type === "multi_choice" ||
        question.type === "drop_down"
      ) {
        if (!question.options) {
          errors.push(`Question ${index + 1}: Missing 'options' array`);
        } else if (!Array.isArray(question.options)) {
          errors.push(`Question ${index + 1}: 'options' must be an array`);
        } else if (question.options.length === 0) {
          errors.push(`Question ${index + 1}: 'options' array cannot be empty`);
        } else {
          question.options.forEach((option, optionIndex) => {
            if (typeof option !== "string") {
              errors.push(
                `Question ${index + 1}: Option ${
                  optionIndex + 1
                } must be a string`
              );
            }
          });
        }

        if (question.type === "multi_choice") {
          if (question.min && typeof question.min !== "number") {
            errors.push(`Question ${index + 1}: 'min' must be a number`);
          }
          if (question.max && typeof question.max !== "number") {
            errors.push(`Question ${index + 1}: 'max' must be a number`);
          }
          if (question.min && question.max && question.min > question.max) {
            errors.push(
              `Question ${index + 1}: 'min' cannot be greater than 'max'`
            );
          }
        }

        if (
          question.type === "drop_down" &&
          question.placeholder &&
          typeof question.placeholder !== "string"
        ) {
          errors.push(`Question ${index + 1}: 'placeholder' must be a string`);
        }
      }

      // Validate date_picker question props
      if (question.type === "date_picker") {
        if (question.minDate && typeof question.minDate !== "string") {
          errors.push(`Question ${index + 1}: 'minDate' must be a string`);
        }
        if (question.maxDate && typeof question.maxDate !== "string") {
          errors.push(`Question ${index + 1}: 'maxDate' must be a string`);
        }
        if (question.placeholder && typeof question.placeholder !== "string") {
          errors.push(`Question ${index + 1}: 'placeholder' must be a string`);
        }
        if (question.minDate && !/^\d{4}-\d{2}-\d{2}$/.test(question.minDate)) {
          errors.push(
            `Question ${index + 1}: 'minDate' must be in YYYY-MM-DD format`
          );
        }
        if (
          question.maxDate &&
          question.maxDate !== "today" &&
          !/^\d{4}-\d{2}-\d{2}$/.test(question.maxDate)
        ) {
          errors.push(
            `Question ${
              index + 1
            }: 'maxDate' must be in YYYY-MM-DD format or "today"`
          );
        }
      }

      // Validate file upload question props

      if (question.type === "file_upload") {
        if (!question.accept) {
          errors.push(`Question ${index + 1}: Missing 'accept' field`);
        } else if (typeof question.accept !== "string") {
          errors.push(`Question ${index + 1}: 'accept' must be a string`);
        }
        if (question.maxSize === undefined) {
          errors.push(`Question ${index + 1}: Missing 'maxSize' field`);
        } else if (typeof question.maxSize !== "number") {
          errors.push(`Question ${index + 1}: 'maxSize' must be a number`);
        } else if (question.maxSize <= 0) {
          errors.push(
            `Question ${index + 1}: 'maxSize' must be greater than 0`
          );
        }
        if (question.multiple === undefined) {
          errors.push(`Question ${index + 1}: Missing 'multiple' field`);
        } else if (typeof question.multiple !== "boolean") {
          errors.push(`Question ${index + 1}: 'multiple' must be a boolean`);
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}
