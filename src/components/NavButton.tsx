import React from "react";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({
    children,
    ...props
}) => (
    <button
        type="button"
        {...props}
        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md 
               hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 
               focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
        {children}
    </button>
);
