import type {
  FormData,
  FormSubmissionResponse,
  SubmissionLog,
} from "../types/form";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const serializeFormData = (data: FormData) => {
  const serialized: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      serialized[key] = {
        type: "File",
        name: value.name,
        size: value.size,
        lastModified: value.lastModified,
        mimeType: value.type,
      };
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof File
    ) {
      serialized[key] = (value as File[]).map((file) => ({
        type: "File",
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        mimeType: file.type,
      }));
    } else {
      serialized[key] = value;
    }
  });

  return serialized;
};

const downloadJSONFile = (data: SubmissionLog, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const submitKYCForm = async (
  data: FormData
): Promise<FormSubmissionResponse> => {
  // Simulate network delay
  await delay(2000);

  const serializedData = serializeFormData(data);

  const submissionLog: SubmissionLog = {
    timestamp: new Date().toISOString(),
    submissionId: `kyc_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    formData: serializedData,
  };

  // Log submission
  console.log("=== KYC Form Submission ===");
  console.log("Submission ID:", submissionLog.submissionId);
  console.log("Timestamp:", submissionLog.timestamp);
  console.log("Form Data:", JSON.stringify(serializedData, null, 2));
  console.log("=========================");

  const filename = `kyc_submission_${submissionLog.submissionId}.json`;
  downloadJSONFile(submissionLog, filename);

  // Simulate random success/failure (to make sure error banner works currently it's 90% success rate)
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      message:
        "KYC form submitted successfully! Your information has been recorded and saved to a JSON file.",
      data: data,
      submissionId: submissionLog.submissionId,
    };
  } else {
    throw new Error("Failed to submit form. Please try again later.");
  }
};

export const validateKYCData = async (
  data: FormData
): Promise<{ isValid: boolean; errors?: string[] }> => {
  await delay(500);

  const errors: string[] = [];

  if (
    data.full_name &&
    typeof data.full_name === "string" &&
    data.full_name.length < 2
  ) {
    errors.push("Full name must be at least 2 characters long");
  }

  if (
    data.email &&
    typeof data.email === "string" &&
    !data.email.includes("@")
  ) {
    errors.push("Please provide a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};
