import React from "react";
import type { DropDownQuestion } from "../../types/form";

interface DropDownInputProps {
  question: DropDownQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DropDownInput: React.FC<DropDownInputProps> = ({
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

      <select
        id={question.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          transition-colors duration-200
          ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 bg-white dark:bg-gray-800"
          }
        `}>
        <option value="">
          {question.placeholder || `Select ${question.label.toLowerCase()}`}
        </option>
        {question.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
