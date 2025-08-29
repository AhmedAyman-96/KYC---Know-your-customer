import React, { useCallback, useMemo } from "react";
import { LoadingIcon } from "./icons";
import { FormField } from "./FormField";
import { ResetButton } from "./ResetButton";
import { StepProgress } from "./StepProgress";
import { NavButton } from "./NavButton";
import { PrimaryButton } from "./PrimaryButton";
import { useAppStore } from "../store/useAppStore";
import type {
  Control,
  FieldErrors,
  UseFormTrigger,
} from "react-hook-form";
import type { FormSchema, FormData } from "../types/form";

interface MultiStepFormProps {
  schema: FormSchema;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
  trigger: UseFormTrigger<FormData>;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  schema,
  control,
  errors,
  onNext,
  onPrevious,
  onSubmit,
  onReset,
  isSubmitting,
  trigger,
}) => {
  const {
    currentStep,
    totalSteps,
    isMultiStep,
    questionsPerStep,
    setHasProgressedPastStep1
  } = useAppStore();

  const currentQuestions = useMemo(() => {
    if (!isMultiStep) return schema;
    const start = (currentStep - 1) * questionsPerStep;
    return schema.slice(start, start + questionsPerStep);
  }, [isMultiStep, schema, currentStep, questionsPerStep]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = useCallback(async () => {
    const ids = currentQuestions.map((q) => q.id);
    const valid = await trigger(ids);

    if (valid) {
      if (currentStep === 1) {
        setHasProgressedPastStep1(true);
      }
      onNext();
    }
  }, [currentQuestions, trigger, onNext, currentStep, setHasProgressedPastStep1]);

  const handleFinalSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="space-y-8">
      {isMultiStep && totalSteps > 1 && (
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      {/* Current Step */}
      <div className="space-y-6">
        {currentQuestions.map((q) => (
          <FormField
            key={q.id}
            question={q}
            control={control}
            errors={errors}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {!isFirstStep && (
            <NavButton onClick={onPrevious} disabled={isSubmitting}>
              ← Previous
            </NavButton>
          )}
          <PrimaryButton
            onClick={isLastStep ? handleFinalSubmit : handleNext}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                {isLastStep ? "Submitting..." : "Loading..."}
              </>
            ) : (
              <>{isLastStep ? "Submit" : "Next →"}</>
            )}
          </PrimaryButton>
        </div>

        <ResetButton onClick={onReset} disabled={isSubmitting}>
          Reset Form
        </ResetButton>
      </div>
    </div>
  );
};




