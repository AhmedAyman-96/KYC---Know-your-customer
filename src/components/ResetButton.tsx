import React from "react";

interface ResetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
    ...props
}) => (
    <button
        type="button"
        {...props}
        className="px-6 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md 
               hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 
               focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
        Reset Form
    </button>
);
