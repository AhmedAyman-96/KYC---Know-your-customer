import React from "react";
import { SunIcon, MoonIcon } from "./icons";
import { useAppStore } from "../store/useAppStore";

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useAppStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md border transition-colors duration-200
        border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500`}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      {isDarkMode ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
};
