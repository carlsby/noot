import { useState } from "react"
import { Plus, NotepadText } from "lucide-react"

export default function AddCategoryForm({ addCategory }) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return
    addCategory(newCategoryName)
    setNewCategoryName("")
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
        <NotepadText size={16} className="text-slate-400" />
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
        placeholder="Ny anteckning"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className={`p-2  text-white rounded-lg transition-colors shadow-sm ${newCategoryName.trim() === "" ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}`}
        onClick={handleAddCategory}
        disabled={newCategoryName.trim() === ""}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
