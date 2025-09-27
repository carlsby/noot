import { useEffect, useState } from "react"
import { Moon, Sun, Rocket, ChevronDown } from "lucide-react"

const THEMES = [
  { value: "light", label: "Ljust läge", icon: <Sun size={16} className="text-yellow-500" /> },
  { value: "dark", label: "Mörkt läge", icon: <Moon size={16} className="text-gray-400" /> },
  // { value: "space", label: "Rymd-läge", icon: <Rocket size={16} className="text-indigo-400" /> },
]

export default function ThemeDropdown({ fetchTheme }) {
  const [theme, setTheme] = useState("light")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false);

  const getCurrentTheme = async () => {
    setLoading(true);
    let result = await fetchTheme();
    setTheme(result);
        setLoading(false);
  }

  useEffect(() => {
    getCurrentTheme();
  }, [])

  const applyTheme = (newTheme) => {
    document.documentElement.classList.remove(...THEMES.map(t => t.value))
    document.documentElement.classList.add(newTheme)
  }

  const handleSelect = async (newTheme) => {
    setIsOpen(false);
    setTheme(newTheme)
    applyTheme(newTheme)
    try {
      await window.electronAPI.invoke("set-color-mode", newTheme)
    } catch (err) {
      console.error("Failed to save theme:", err)
    }
  }

  const selectedTheme = THEMES.find(t => t.value === theme)

  return (
    !loading &&
    <div className="flex flex-col w-full relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 space:bg-gray-950 space:text-indigo-400 transition-colors focus:outline-none focus:ring-0 focus:shadow-none"
      >
        <div className="flex items-center gap-2">
          {selectedTheme?.icon}
          {selectedTheme?.label || "Välj tema"}
        </div>
        <ChevronDown
          size={16}
          className={`text-neutral-500 dark:text-neutral-400 space:text-green-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 space:border-indigo-950  dark:border-neutral-700 shadow-xl max-h-60 overflow-y-auto">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleSelect(t.value)}
                className={`w-full px-4 py-3 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 space:bg-gray-950 transition-colors ${
                  theme === t.value
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 space:text-indigo-400 space:hover:bg-gray-900"
                    : "text-neutral-700 dark:text-neutral-300 space:text-green-400 space:hover:bg-gray-900"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
