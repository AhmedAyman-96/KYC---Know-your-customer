import React, { useState, useRef, useEffect } from "react";
import { SchemaLoader } from "../services/schemaLoader";
import { useAppStore } from "../store/useAppStore";
import type { FormSchema } from "../types/form";

// Sample schema files available in public/schemas/
const SAMPLE_SCHEMAS = [
  { name: "Default Schema", file: "default-schema.json", description: "Default form schema (currently loaded)" },
  { name: "Basic KYC", file: "basic-kyc.json", description: "Simple form with basic fields" },
  { name: "Advanced KYC", file: "advanced-kyc.json", description: "Comprehensive KYC form" },
  { name: "Corporate KYC", file: "corporate-kyc.json", description: "Business entity verification" },
  { name: "Fintech KYC", file: "fintech-kyc.json", description: "Financial services onboarding" },
  { name: "Investment KYC", file: "investment-kyc.json", description: "Investment account setup" },
  { name: "Test Single Image", file: "test-single-image.json", description: "Profile picture upload test" },
  { name: "Invalid Schema Test", file: "invalid-schema-test.json", description: "Test validation with multiple errors" },
];

interface SchemaManagerProps {
  onSchemaChange: (schema: FormSchema) => void;
}

export const SchemaManager: React.FC<SchemaManagerProps> = ({
  onSchemaChange,
}) => {
  const { clearCurrentSchema, isCustomSchema, setIsCustomSchema, setCurrentSchema } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultSchema, setDefaultSchema] = useState<FormSchema | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default schema on component mount
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await SchemaLoader.loadFromFile(file);
      if (result.success && result.schema) {
        onSchemaChange(result.schema);
        setIsCustomSchema(true);
      } else {
        setError(result.error || "Could not load schema.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    }
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

  };

  const handleReset = () => {
    clearCurrentSchema();
    setIsCustomSchema(false);
    if (defaultSchema) {
      setCurrentSchema(defaultSchema);
    }
    setError(null);
  };

  const downloadSampleSchema = async (fileName: string, schemaName: string) => {
    try {
      const response = await fetch(`/schemas/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to download ${schemaName}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to download ${schemaName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const isCustom = isCustomSchema;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Schema Management
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Schema
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isCustom ? "Custom schema loaded" : "Default schema in use"}
            </p>
          </div>
          {isCustom && (
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400
                        border border-blue-300 dark:border-blue-600 rounded
                        hover:bg-blue-50 dark:hover:bg-blue-900/20
                        focus:outline-none focus:ring-1 focus:ring-blue-500">
              Reset
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Load from JSON
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       dark:file:bg-blue-900 dark:file:text-blue-300
                       dark:hover:file:bg-blue-800"
          />
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Upload a JSON file containing form field definitions. Each field
            should have <code>id</code>, <code>label</code>, and{" "}
            <code>type</code>.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Download Sample Schemas
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_SCHEMAS.map((schema) => (
              <button
                key={schema.file}
                onClick={() => downloadSampleSchema(schema.file, schema.name)}
                disabled={isLoading}
                className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-md
                          hover:bg-gray-50 dark:hover:bg-gray-700
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors duration-200">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {schema.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {schema.description}
                </div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Download sample schemas to see examples of different form configurations.
            After downloading, you can upload them back using the file input above.
          </p>
        </div>

        {error && (
          <div
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md
                          dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
