import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header";
import { KYCForm } from "./components/KYCForm";
import { SuccessPage } from "./components/SuccessPage";
import { SchemaManager } from "./components/SchemaManager";
import { ErrorBanner } from "./components/ErrorBanner";
import { useAppStore } from "./store/useAppStore";
import { submitKYCForm } from "./services/mockApi";
import type { FormData, FormSchema } from "./types/form";

function App() {
  const { isDarkMode, isDevMode, currentSchema, setCurrentSchema, setIsCustomSchema } =
    useAppStore();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [defaultSchema, setDefaultSchema] = useState<FormSchema | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const loadDefaultSchema = async () => {
      try {
        const response = await fetch('/schemas/default-schema.json');
        if (!response.ok) {
          throw new Error('Failed to load default schema');
        }
        const schema = await response.json();
        setDefaultSchema(schema);
      } catch (err) {
        console.error('Failed to load default schema:', err);
        setError('Failed to load default schema');
      }
    };

    loadDefaultSchema();
  }, []);

  const activeSchema = currentSchema || defaultSchema;

  const handleFormSubmit = async (data: FormData) => {
    setError(null);
    try {
      const response = await submitKYCForm(data);
      if (response.success) {
        setSubmittedData(data);
        setSubmissionId(response.submissionId ?? null);
        setIsSubmitted(true);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred."
      );
    }
  };

  const handleSchemaChange = (schema: FormSchema) => {
    setCurrentSchema(schema);
    setIsCustomSchema(true);
    setIsSubmitted(false);
    setSubmittedData(null);
    setSubmissionId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      <Header />

      <main className="py-8">
        {error && (
          <ErrorBanner error={error} onDismiss={() => setError(null)} />
        )}

        {isSubmitted && submittedData ? (
          <SuccessPage
            submittedData={submittedData}
            submissionId={submissionId || undefined}
          />
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Know Your Customer Form
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please fill out all required fields to complete your
                verification.
              </p>
            </div>

            {isDevMode && <SchemaManager onSchemaChange={handleSchemaChange} />}

            <div className="max-w-2xl mx-auto">
              {activeSchema ? (
                <KYCForm schema={activeSchema} onSubmit={handleFormSubmit} />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading form...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
