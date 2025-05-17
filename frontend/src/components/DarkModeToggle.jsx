import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-1.5 rounded-full transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-200 hover:bg-gray-300"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun size={16} className="text-gray-100" />
      ) : (
        <Moon size={16} className="text-gray-600" />
      )}
    </button>
  );
}
