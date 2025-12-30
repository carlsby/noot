import { useState, useEffect } from "react";

export default function useTheme() {
  const [fontCss, setFontCss] = useState("Lexend, sans-serif");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    (async () => {
      await fetchTheme();
      await loadFont();
    })();
  }, []);

  async function fetchTheme() {
    try {
      const mode = await window.electronAPI.invoke("get-color-mode");
      const THEMES = ["light", "dark", "space", "robot"];

      document.documentElement.classList.remove(...THEMES);

      const appliedTheme = THEMES.includes(mode) ? mode : "light";
      document.documentElement.classList.add(appliedTheme);
      setTheme(appliedTheme);
      return appliedTheme;
    } catch (err) {
      console.error("Failed to get color mode:", err);
      document.documentElement.classList.remove("dark", "space", "robot");
      document.documentElement.classList.add("light");
      setTheme("light");
    }
  }

  async function loadFont() {
    const font = await window.electronAPI.invoke("get-default-font");
    if (font?.css) {
      setFontCss(font.css);
    }
  }

  async function getAllFonts() {
    return await window.electronAPI.invoke("get-all-fonts");
  }

  const setDefaultFont = async (fontId) => {
    const font = await window.electronAPI.invoke("set-default-font", fontId);
    if (font?.css) {
      setFontCss(font.css);
    }
  };

  return { fontCss, theme, setDefaultFont, fetchTheme, getAllFonts, loadFont };
}
