import React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import type { NumberQuestion } from "../../types/form";

interface NumberInputProps {
    question: NumberQuestion;
    control: Control<any>;
    error?: FieldError;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    question,
    control,
    error,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={question.id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {question.label}
                {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <Controller
                name={question.id}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        type="number"
                        id={question.id}
                        placeholder={question.placeholder}
                        min={question.min}
                        max={question.max}
                        step={question.step}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${error
                            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                            }`}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Convert empty string to undefined for optional fields
                            field.onChange(value === "" ? undefined : Number(value));
                        }}
                        value={field.value === undefined ? "" : field.value}
                    />
                )}
            />

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                </p>
            )}

            {/* Show min/max constraints as helper text */}
            {(question.min !== undefined || question.max !== undefined) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {question.min !== undefined && question.max !== undefined
                        ? `Range: ${question.min} - ${question.max}`
                        : question.min !== undefined
                            ? `Minimum: ${question.min}`
                            : `Maximum: ${question.max}`}
                </p>
            )}
        </div>
    );
};
