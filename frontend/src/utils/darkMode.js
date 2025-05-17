// Utility to handle dark mode with localStorage
export const initializeDarkMode = () => {
  // Only run on client side
  if (typeof window === "undefined") return false;

  // Check for saved preference in localStorage
  const savedDarkMode = localStorage.getItem("darkMode");
  
  // Check for system preference if no saved preference
  const systemPrefersDark = window.matchMedia && 
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Set initial dark mode
  const initialDarkMode = savedDarkMode === "true" ? true : 
                         savedDarkMode === "false" ? false : 
                         systemPrefersDark;
  
  // Apply dark mode class to html element
  if (initialDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  return initialDarkMode;
};

export const toggleDarkMode = (isDark) => {
  // Toggle dark mode class on html element
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  // Save preference to localStorage
  localStorage.setItem("darkMode", isDark.toString());
};
