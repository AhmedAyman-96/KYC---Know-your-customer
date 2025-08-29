import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    ...props
}) => (
    <button
        type="button"
        {...props}
        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-primary-800
               text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500
               focus:ring-offset-2 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center">
        {children}
    </button>
);
