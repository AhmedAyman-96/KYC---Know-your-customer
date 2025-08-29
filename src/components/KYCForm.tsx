import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

import { LoadingIcon } from "./icons";
import { FormField } from "./FormField";
import { MultiStepForm } from "./MultiStepForm";
import { FormSettings } from "./FormSettings";
import { ResetButton } from "./ResetButton";
import { PrimaryButton } from "./PrimaryButton";

import { useAppStore } from "../store/useAppStore";
import { useFormStore } from "../store/useFormStore";

import {
  createValidationSchema,
  getDefaultFormData,
} from "../utils/validation";

import type { FormSchema, FormData } from "../types/form";

interface KYCFormProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => Promise<void>;
}

export const KYCForm: React.FC<KYCFormProps> = ({ schema, onSubmit }) => {
  const {
    isSubmitting,
    setIsSubmitting,
    isMultiStep,
    setTotalSteps,
    currentStep,
    setCurrentStep,
    questionsPerStep,
    setHasProgressedPastStep1,
  } = useAppStore();

  const { formData, setFormDataWithFilter, clearFormData } = useFormStore();

  const isInitialLoad = useRef(true);
  const previousValues = useRef<string>("");

  const validationSchema = useMemo(
    () => createValidationSchema(schema),
    [schema]
  );
  const defaultValues = useMemo(() => getDefaultFormData(schema), [schema]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema) as Resolver<FormData>,
    defaultValues: { ...defaultValues, ...formData }, // add data from local storage if any
    mode: "onChange",
  });


  useEffect(() => {
    const steps = isMultiStep ? Math.ceil(schema.length / questionsPerStep) : 1;
    setTotalSteps(steps);
  }, [isMultiStep, questionsPerStep, schema.length, setTotalSteps]);

  const watchedValues = watch();


  // Persist form data
  useEffect(() => {
    // if the page is reloaded or loaded for the first time let's skip the form data revovery
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const hasFormData = Object.values(watchedValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (hasFormData) {
      const current = JSON.stringify(watchedValues);
      // use refs here 'previousValues' so we make sure the form data is being persisted only if something has changed
      if (current !== previousValues.current) {
        previousValues.current = current;
        setFormDataWithFilter(watchedValues, schema);
      }
    }
  }, [watchedValues, schema, setFormDataWithFilter]);

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      clearFormData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    clearFormData();
    setCurrentStep(1);
    setHasProgressedPastStep1(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormSettings />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {isMultiStep ? (
          <MultiStepForm
            schema={schema}
            control={control}
            errors={errors}
            onNext={() => setCurrentStep(currentStep + 1)}
            onPrevious={() => setCurrentStep(currentStep - 1)}
            onSubmit={() => handleSubmit(onFormSubmit)()}
            onReset={handleReset}
            isSubmitting={isSubmitting}
            trigger={trigger}
          />
        ) : (
          <>
            <div className="space-y-6">
              {schema.map((question) => (
                <FormField
                  key={question.id}
                  question={question}
                  control={control}
                  errors={errors}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <ResetButton onClick={handleReset} disabled={isSubmitting} />

              <PrimaryButton
                type="submit"
                name="submit"
                disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <>
                    <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </PrimaryButton>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
