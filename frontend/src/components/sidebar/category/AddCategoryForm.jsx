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
      className={`flex items-center gap-3 p-3 h-[50px] bg-neutral-50 dark:bg-black rounded-xl border transition-all duration-200 ${
        isFocused
          ? "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-black"
          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
      }`}
    >
      <div className="flex-shrink-0">
        <NotepadText size={16} className="text-neutral-400" />
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 text-sm"
        placeholder="Ny anteckning"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className={`p-2  text-black rounded-lg transition-colors shadow-sm ${newCategoryName.trim() === "" ? "bg-neutral-300 dark:bg-neutral-900" : "bg-neutral-300 hover:bg-neutral-300/80"}`}
        onClick={handleAddCategory}
        disabled={newCategoryName.trim() === ""}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
