import React from "react";
import type { TextAreaQuestion } from "../../types/form";

interface TextAreaInputProps {
  question: TextAreaQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={question.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={question.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        maxLength={question.maxLength}
        rows={question.rows || 3}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm resize-vertical
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          transition-colors duration-200
          ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 bg-white dark:bg-gray-800"
          }
        `}
      />

      {question.maxLength && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {value.length}/{question.maxLength}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
