import { useState } from "react"
import { Plus, NotepadText, Paintbrush } from "lucide-react"

export default function AddPaintForm({ addPainting }) {
  const [newPaintingName, setNewPaintingName] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleAddPainting = () => {
    if (newPaintingName.trim() === "") return
    addPainting(newPaintingName)
    setNewPaintingName("")
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border transition-all duration-200 ${
        isFocused
          ? "border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-700"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <div className="flex-shrink-0">
        <Paintbrush size={16} className="text-slate-400" />
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
        placeholder="Ny målning"
        value={newPaintingName}
        onChange={(e) => setNewPaintingName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddPainting()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className={`p-2  text-white rounded-lg transition-colors shadow-sm ${newPaintingName.trim() === "" ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}`}
        onClick={handleAddPainting}
        disabled={newPaintingName.trim() === ""}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
