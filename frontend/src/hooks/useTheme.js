import { useCallback, useEffect, useState } from "react";

export const THEMES = [
  { value: "light", label: "Ljust" },
  { value: "dark", label: "Mörkt" },
  { value: "sepia", label: "Sepia" },
  { value: "slate", label: "Skiffer" },
  { value: "forest", label: "Skog" },
  { value: "rose", label: "Ros" },
];

function applyTheme(value) {
  const theme = THEMES.some((item) => item.value === value) ? value : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
  localStorage.setItem("noot.theme", theme);
  return theme;
}

const initialTheme = applyTheme(localStorage.getItem("noot.theme"));

export default function useTheme() {
  const [fontCss, setFontCss] = useState("'Lexend', sans-serif");
  const [theme, setTheme] = useState(initialTheme);
  const [noteFontSize, setNoteFontSize] = useState(14);
  const [fontSizeSaving, setFontSizeSaving] = useState(false);
  const [fontSizeError, setFontSizeError] = useState("");

  useEffect(() => {
    document.documentElement.style.fontFamily = fontCss;
  }, [fontCss]);

  useEffect(() => {
    let active = true;
    window.electronAPI.invoke("get-color-mode").then((mode) => {
      if (!active) return;
      setTheme(applyTheme(mode));
    }).catch((error) => console.error("Failed to load theme:", error));
    window.electronAPI.invoke("get-default-font").then((font) => {
      if (!active) return;
      if (font?.css) setFontCss(font.css);
    }).catch((error) => console.error("Failed to load font:", error));
    window.electronAPI.invoke("get-note-font-size").then((size) => {
      if (active && Number.isInteger(size) && size >= 12 && size <= 20) setNoteFontSize(size);
    }).catch(() => { if (active) setFontSizeError("Kunde inte läsa textstorleken."); });
    return () => { active = false; };
  }, []);

  const changeTheme = async (value) => {
    const next = applyTheme(value);
    setTheme(next);
    await window.electronAPI.invoke("set-color-mode", next);
  };

  const setDefaultFont = async (fontId) => {
    const font = await window.electronAPI.invoke("set-default-font", fontId);
    if (font?.css) setFontCss(font.css);
  };
  const getAllFonts = useCallback(() => window.electronAPI.invoke("get-all-fonts"), []);

  const changeNoteFontSize = async (size) => {
    if (!Number.isInteger(size) || size < 12 || size > 20) return;
    setFontSizeSaving(true);
    setFontSizeError("");
    try {
      const saved = await window.electronAPI.invoke("set-note-font-size", size);
      setNoteFontSize(saved);
    } catch {
      setFontSizeError("Kunde inte spara textstorleken.");
    } finally {
      setFontSizeSaving(false);
    }
  };

  return {
    fontCss, theme, changeTheme, setDefaultFont,
    noteFontSize, changeNoteFontSize, fontSizeSaving, fontSizeError,
    getAllFonts,
  };
}
