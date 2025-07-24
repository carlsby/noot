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
      className="w-full flex items-center py-3 px-4"
    >
      {darkMode ? (
        <div className="flex items-center gap-2 text-black dark:text-white"><Sun size={18} className="text-gray-500" />Växla till ljust läge</div>
      ) : (
        <div className="flex items-center gap-2 text-black dark:text-white"><Moon size={18} className="text-gray-500" />Växla till mörkt läge</div>
      )}
    </button>
  )
}
