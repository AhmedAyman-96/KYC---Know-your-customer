import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Clear Data",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                transition-colors duration-200
              ">
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="
                px-4 py-2 text-sm font-medium text-white 
                bg-red-600 hover:bg-red-700 
                rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                transition-colors duration-200
              ">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
