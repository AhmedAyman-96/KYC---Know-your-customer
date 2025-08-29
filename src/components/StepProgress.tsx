import React from "react";

interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
    currentStep,
    totalSteps,
}) => (
    <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Step {currentStep} of {totalSteps}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
            {Array.from({ length: totalSteps }, (_, idx) => {
                const step = idx + 1;
                const isActive = step === currentStep;
                const isComplete = step < currentStep;
                return (
                    <div
                        key={idx}
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
              ${isActive
                                ? "bg-primary-600 text-white"
                                : isComplete
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }
            `}>
                        {isComplete ? "✓" : step}
                    </div>
                );
            })}
        </div>
    </div>
);
