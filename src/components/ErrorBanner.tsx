import React from "react";
import { ErrorIcon } from "./icons";

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onDismiss,
}) => {
  return (
    <div className="max-w-2xl mx-auto mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div className="flex">
        <div className="flex-shrink-0">
          <ErrorIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Submission Error
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={onDismiss}
            type="button"
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-150">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
