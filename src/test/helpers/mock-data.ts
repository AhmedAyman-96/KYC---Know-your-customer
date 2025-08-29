import type { FormSchema } from "../../types/form";

export const testSchema: FormSchema = [
  {
    id: "full_name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
    maxLength: 100,
  },
  {
    id: "email",
    label: "Email Address",
    type: "text",
    required: true,
    placeholder: "Enter your email address",
  },
  {
    id: "bio",
    label: "Bio",
    type: "textarea",
    required: false,
    placeholder: "Tell us about yourself",
    rows: 4,
    maxLength: 500,
  },
  {
    id: "gender",
    label: "Gender",
    type: "radio_buttons",
    required: true,
    options: ["Male", "Female", "Other"],
  },
  {
    id: "hobbies",
    label: "Hobbies",
    type: "multi_choice",
    required: true,
    options: ["Reading", "Gaming", "Sports"],
    min: 1,
    max: 2,
  },
  {
    id: "country",
    label: "Country",
    type: "drop_down",
    required: true,
    options: ["USA", "UK", "Canada"],
    placeholder: "Select your country",
  },
  {
    id: "birth_date",
    label: "Birth Date",
    type: "date_picker",
    required: true,
    maxDate: "2005-12-31",
  },
  {
    id: "documents",
    label: "Documents",
    type: "file_upload",
    required: true,
    accept: ".pdf,.jpg,.png",
    maxSize: 5,
    multiple: true,
  },
];

export const simpleSchema: FormSchema = [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    required: true,
  },
];

export const createMockFile = (
  name: string = "test.pdf",
  size: number = 1024,
  type: string = "application/pdf"
): File => {
  const file = new File(["test content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

export const validFormData = {
  full_name: "Ahmed Ayman",
  email: "ahmed@example.com",
  bio: "I am a developer",
  gender: "Male",
  hobbies: ["Reading"],
  country: "USA",
  birth_date: "1990-01-01",
  documents: [createMockFile()],
};
