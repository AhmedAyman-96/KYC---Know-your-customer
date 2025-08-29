import React from "react";
import { CheckIcon, DocumentIcon } from "./icons";
import type { FormData } from "../types/form";
import { useAppStore } from "../store/useAppStore";

interface SuccessPageProps {
  submittedData: FormData;
  submissionId?: string;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  submittedData,
  submissionId,
}) => {
  const { resetForm } = useAppStore();

  const handleNewSubmission = () => {
    resetForm();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Form Submitted Successfully!
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Thank you for completing the KYC form. Your information has been
              submitted and recorded. A JSON file with your submission data has
              been downloaded.
            </p>
            {submissionId && (
              <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-mono">
                Submission ID: {submissionId}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Submitted Information
        </h4>

        <div className="space-y-4">
          {Object.entries(submittedData).map(([key, value]) => (
            <div
              key={key}
              className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/_/g, " ")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {value instanceof File ? (
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {value.name} ({(value.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : Array.isArray(value) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {value.map((item, index) => (
                      <li key={index}>
                        {item instanceof File ? (
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                            <span>
                              {item.name} ({(item.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  value || <em className="text-gray-400">Not provided</em>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleNewSubmission}
          className="
            bg-primary-600 hover:bg-primary-700 
            text-white font-medium py-3 px-6 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            transition-colors duration-200
          ">
          Start New Form
        </button>
      </div>
    </div>
  );
};
