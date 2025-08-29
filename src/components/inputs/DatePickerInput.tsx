import React from "react";
import { CloseIcon, CalendarIcon } from "../icons";
import type { DatePickerQuestion } from "../../types/form";

interface DatePickerInputProps {
  question: DatePickerQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    } catch {
      return "";
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "";
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMinDate = () => {
    if (question.minDate) {
      if (question.minDate === "today") {
        return getTodayDate();
      }
      return formatDate(question.minDate);
    }
    return undefined;
  };

  const getMaxDate = () => {
    if (question.maxDate) {
      if (question.maxDate === "today") {
        return getTodayDate();
      }
      return formatDate(question.maxDate);
    }
    return undefined;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClearClick = () => {
    onChange("");
  };

  const handleCalendarClick = () => {
    const input = document.getElementById(question.id) as HTMLInputElement;
    if (input) {
      if (input.showPicker) {
        input.showPicker();
      } else {
        input.click();
      }
    }
  };

  const isValidDateRange = (date: string) => {
    if (!date) return true;
    const minDate = getMinDate();
    const maxDate = getMaxDate();

    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={question.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={question.id}
          type="date"
          value={value}
          onChange={handleDateChange}
          min={getMinDate() || undefined}
          max={getMaxDate() || undefined}
          placeholder={question.placeholder}
          style={{ colorScheme: "light dark" }} // it was not displayed in some browsers
          className={`
            w-full px-3 py-2 pr-16 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            transition-colors duration-200
            cursor-pointer
            ${error || !isValidDateRange(value)
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 bg-white dark:bg-gray-800"
            }
          `}
        />

        {/* Icons container */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none date-picker-icons">
          {/* Calendar icon */}
          <button
            type="button"
            onClick={handleCalendarClick}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 
              hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 
              pointer-events-auto focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-1 rounded-md group"
            title="Open date picker">
            <CalendarIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Clear button*/}
          {value && (
            <button
              type="button"
              onClick={handleClearClick}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 
                hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 
                pointer-events-auto focus:outline-none focus:ring-2 focus:ring-red-500 
                focus:ring-offset-1 rounded-md ml-1 group"
              title="Clear date">
              <CloseIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}
        </div>
      </div>

      {/* Date range information */}
      {(question.minDate || question.maxDate) && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {question.minDate && question.maxDate
            ? `Date must be between ${question.minDate === "today" ? "today" : question.minDate
            } and ${question.maxDate === "today" ? "today" : question.maxDate
            }`
            : question.minDate
              ? `Date must be after ${question.minDate === "today" ? "today" : question.minDate
              }`
              : question.maxDate
                ? `Date must be before ${question.maxDate === "today" ? "today" : question.maxDate
                }`
                : ""}
        </div>
      )}

      {/* Display selected date in dd/mm/yyyy format */}
      {value && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {formatDisplayDate(value)}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
