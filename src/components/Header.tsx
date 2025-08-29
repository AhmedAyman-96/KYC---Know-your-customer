import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { DevModeToggle } from "./DevModeToggle";

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              KYC Form
            </h1>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Know Your Customer
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <DevModeToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
