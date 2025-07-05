"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    async function fetchColorMode() {
      try {
        const mode = await window.electronAPI.invoke("get-color-mode")
        const isDark = mode === "dark"
        setDarkMode(isDark)
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } catch (err) {
        console.error("Failed to get color mode:", err)
        setDarkMode(false)
        document.documentElement.classList.remove("dark")
      }
    }
    fetchColorMode()
  }, [])

  const handleToggle = async () => {
    const newMode = !darkMode
    setDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    try {
      await window.electronAPI.invoke("set-color-mode", newMode ? "dark" : "light")
    } catch (err) {
      console.error("Failed to save color mode:", err)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun size={18} className="text-amber-500" />
      ) : (
        <Moon size={18} className="text-slate-600" />
      )}
    </button>
  )
}
