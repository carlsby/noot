import { useEffect, useState } from "react"
import { ALargeSmall, ChevronDown, } from "lucide-react"

export default function FontSelector({ getAllFonts, setDefaultFont, currentFont }) {
  const [fonts, setFonts] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const all = await getAllFonts()
      setFonts(all)
    })()
  }, [])

  const selectedFont = fonts.find((f) => f.css === currentFont)

  const handleSelect = (fontId) => {
    setDefaultFont(fontId)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col w-full relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-3 px-4 bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2 text-black dark:text-white"><ALargeSmall size={18} className="text-gray-500" />{selectedFont?.name || "Välj typsnitt"}</div>
        <ChevronDown
          size={16}
          className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl max-h-60 overflow-y-auto">
            {fonts.map((font) => (
              <button
                key={font._id}
                onClick={() => handleSelect(font._id)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  selectedFont?._id === font._id
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
