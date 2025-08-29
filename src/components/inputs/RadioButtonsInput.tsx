import React from "react";
import type { RadioButtonsQuestion } from "../../types/form";

interface RadioButtonsInputProps {
  question: RadioButtonsQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioButtonsInput: React.FC<RadioButtonsInputProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className={`
                h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600
                focus:ring-primary-500 dark:focus:ring-primary-400
                transition-colors duration-200
                ${error ? "border-red-500" : ""}
              `}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
              {option}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
