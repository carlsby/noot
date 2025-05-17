import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Read saved mode from Electron backend on mount
  useEffect(() => {
    async function fetchColorMode() {
      try {
        // Call Electron main process via preload exposed API
    const mode = await window.electronAPI.invoke("get-color-mode");
        const isDark = mode === "dark";
        setDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (err) {
        console.error("Failed to get color mode:", err);
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
    fetchColorMode();
  }, []);

  // Toggle mode both visually and save to backend
  const handleToggle = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      await window.electronAPI.invoke("set-color-mode", newMode ? "dark" : "light");
    } catch (err) {
      console.error("Failed to save color mode:", err);
    }
  };

  return (
    <button
      onClick={handleToggle}
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
