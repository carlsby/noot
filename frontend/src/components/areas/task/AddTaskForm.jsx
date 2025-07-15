import { useEffect, useRef, useState } from "react"
import { Plus } from "lucide-react"

export default function AddTaskForm({ addTask }) {
  const [newTaskText, setNewTaskText] = useState("")
  const [inputToggle, setInputToggle] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault()
        setInputToggle((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (inputToggle && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputToggle])

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return
    addTask(newTaskText)
    setNewTaskText("")
  }

  return (
    <div className="space-y-3 relative">
      <div
        className={`flex items-center gap-3 ps-2 bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200 ${
          isFocused
            ? "border-purple-300 dark:border-purple-600 shadow-lg shadow-purple-100/50 dark:shadow-purple-900/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
          placeholder="Lägg till en ny anteckning..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          onClick={handleAddTask}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center absolute right-14 top-0">
        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-xs">Ctrl+N</kbd>
      </div>
    </div>
  )
}
