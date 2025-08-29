import React from "react";
import { useAppStore } from "../store/useAppStore";

export const FormSettings: React.FC = () => {
  const {
    isMultiStep,
    setIsMultiStep,
    questionsPerStep,
    setQuestionsPerStep,
    hasProgressedPastStep1
  } = useAppStore();

  const toggleMultiStep = () => setIsMultiStep(!isMultiStep);

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Multi-step toggle */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Multi-step form
          </span>
          <button
            type="button"
            onClick={toggleMultiStep}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${isMultiStep ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
              }`}>
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isMultiStep ? "translate-x-5" : "translate-x-1"
                }`}
            />
          </button>
        </div>

        {/* Questions per step */}
        {isMultiStep && (
          <label className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className={`text-sm ${hasProgressedPastStep1 ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
              Questions per step:
            </span>
            <select
              value={questionsPerStep}
              onChange={(e) => setQuestionsPerStep(Number(e.target.value))}
              disabled={hasProgressedPastStep1}
              className={`px-3 py-1.5 pr-8 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-[120px] w-full sm:w-auto ${hasProgressedPastStep1
                  ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'
                }`}>
              {[2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>
            {hasProgressedPastStep1 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                Reset form to change
              </span>
            )}
          </label>
        )}
      </div>
    </section>
  );
};
