import React, { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { UploadIcon, DocumentIcon, CloseIcon } from "../icons";
import type { FileUploadQuestion } from "../../types/form";

interface FileUploadInputProps {
  question: FileUploadQuestion;
  value: File | File[] | null;
  onChange: (value: File | File[] | null) => void;
  error?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImageFile = (file: File) => file.type.startsWith("image/");
  const shouldShowImagePreview =
    !question.multiple &&
    question.accept &&
    question.accept.split(",").some(
      (type) =>
        type
          .trim()
          .toLowerCase()
          .match(/\.(jpg|jpeg|png|gif|webp|svg)$/) ||
        type.trim().toLowerCase().startsWith("image/")
    );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (question.maxSize && file.size > question.maxSize * 1024 * 1024) {
      return `File size must be less than ${question.maxSize}MB`;
    }

    if (question.accept) {
      const acceptedTypes = question.accept
        .split(",")
        .map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const mimeType = file.type;

      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith(".")) {
          return fileExtension === acceptedType.toLowerCase();
        }
        return mimeType.match(acceptedType.replace("*", ".*"));
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${question.accept}`;
      }
    }

    return null;
  };

  const cleanupPreviewUrl = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        onChange(question.multiple ? [] : null);
        cleanupPreviewUrl();
      }
      return;
    }

    const selectedFiles = Array.from(files);

    for (const file of selectedFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
    }

    if (question.multiple) {
      // Append new files to existing ones instead of overwriting
      const existingFiles = Array.isArray(value) ? value : [];
      const combinedFiles = [...existingFiles, ...selectedFiles];
      onChange(combinedFiles);
      toast.success(`${selectedFiles.length} file(s) added successfully`);
    } else {
      onChange(selectedFiles[0]);
      toast.success("File uploaded successfully");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileSelection(files);
    // Use setTimeout to ensure the file selection is processed first for race condition
    setTimeout(() => {
      if (e.target) {
        e.target.value = "";
      }
    }, 0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeFile = (indexToRemove?: number) => {
    // Clear the file input value to prevent reopening the file dialog
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (question.multiple && Array.isArray(value)) {
      if (indexToRemove !== undefined) {
        const newFiles = value.filter((_, index) => index !== indexToRemove);
        onChange(newFiles.length > 0 ? newFiles : []);
        toast.success("File removed");
      } else {
        onChange([]);
        toast.success("All files removed");
      }
    } else {
      onChange(null);
      cleanupPreviewUrl();
      toast.success("File removed");
    }
  };

  const getFileList = (): File[] => {
    if (!value || (Array.isArray(value) && value.length === 0)) return [];
    return Array.isArray(value) ? value : [value];
  };

  // Sync preview URL with current file value
  React.useEffect(() => {
    if (
      shouldShowImagePreview &&
      value &&
      !Array.isArray(value) &&
      isImageFile(value)
    ) {
      // Clean up any existing preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
    } else if (!value || (Array.isArray(value) && value.length === 0)) {
      cleanupPreviewUrl();
    }
  }, [value, shouldShowImagePreview, previewUrl, cleanupPreviewUrl]);

  React.useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [cleanupPreviewUrl]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Image Preview */}
      {shouldShowImagePreview && previewUrl && (
        <div className="mb-4">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            />
            <button
              type="button"
              onClick={() => removeFile()}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Click the image to change
          </p>
        </div>
      )}

      {/* Hidden file input*/}
      <input
        ref={fileInputRef}
        type="file"
        accept={question.accept}
        multiple={question.multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* File upload area*/}
      {!(shouldShowImagePreview && previewUrl) && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center
            transition-colors duration-200 cursor-pointer
            ${dragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : error
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
            }
            ${!dragActive && !error
              ? "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              : ""
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={(e) => {
            // Only trigger file dialog if clicking the main area, not on child elements
            if (e.target === e.currentTarget) {
              fileInputRef.current?.click();
            }
          }}>
          <div
            className="upload-content space-y-2"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 pointer-events-none" />
            <div className="text-sm text-gray-600 dark:text-gray-400 pointer-events-none">
              <span className="font-medium text-primary-600 dark:text-primary-400">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            {question.accept && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
                Accepted files: {question.accept}
              </p>
            )}
            {question.maxSize && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
                Max size: {question.maxSize}MB
              </p>
            )}
            {question.multiple && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
                Multiple files allowed
              </p>
            )}
          </div>
        </div>
      )}

      {/* Selected files display - only show for non-image previews or when multiple files */}
      {getFileList().length > 0 &&
        (!shouldShowImagePreview || question.multiple) && (
          <div
            className="space-y-2"
            onClick={(e) => e.stopPropagation()} // Prevent file dialog from opening
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected files:
            </p>
            <div className="space-y-2">
              {getFileList().map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  onClick={(e) => e.stopPropagation()} // Prevent bubbling to parent
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFile(question.multiple ? index : undefined);
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors z-10 relative">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
