import React from "react";
import type { MultiChoiceQuestion } from "../../types/form";

interface MultiChoiceInputProps {
  question: MultiChoiceQuestion;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      if (
        !value.includes(option) &&
        (!question.max || value.length < question.max)
      ) {
        onChange([...value, option]);
      }
    } else {
      onChange(value.filter((v) => v !== option));
    }
  };

  const isOptionDisabled = (option: string) => {
    return (
      !value.includes(option) && question.max && value.length >= question.max
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {(question.min || question.max) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select{" "}
            {question.min && question.max
              ? `${question.min}-${question.max}`
              : question.min
              ? `at least ${question.min}`
              : question.max
              ? `up to ${question.max}`
              : ""}{" "}
            option(s)
          </p>
        )}
      </div>

      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className={`
              flex items-center space-x-3 cursor-pointer group
              ${isOptionDisabled(option) ? "opacity-50 cursor-not-allowed" : ""}
            `}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              disabled={!!isOptionDisabled(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              className={`
                h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600
                rounded focus:ring-primary-500 dark:focus:ring-primary-400
                transition-colors duration-200
                ${error ? "border-red-500" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
              {option}
            </span>
          </label>
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {value.length} selected
        {question.max && ` (max ${question.max})`}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
