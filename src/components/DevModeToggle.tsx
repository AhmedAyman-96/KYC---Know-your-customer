import React from "react";
import { useAppStore } from "../store/useAppStore";

export const DevModeToggle: React.FC = () => {
  const { isDevMode, toggleDevMode } = useAppStore();

  return (
    <button
      onClick={toggleDevMode}
      className={`p-2 rounded-md border transition-colors duration-200
        ${
          isDevMode
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200"
            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        }
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500`}
      title={`Dev mode: ${isDevMode ? "ON" : "OFF"}`}>
      <div className="w-5 h-5 flex items-center justify-center relative">
        <span className="text-xs font-mono font-bold">DEV</span>
        {isDevMode && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        )}
      </div>
    </button>
  );
};
