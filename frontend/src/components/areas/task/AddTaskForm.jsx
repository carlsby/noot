import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

export default function AddTaskForm({ addTask }) {
  const [newTaskText, setNewTaskText] = useState("");
  const [inputToggle, setInputToggle] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        setInputToggle((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (inputToggle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputToggle]);

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    addTask(newTaskText);
    setNewTaskText("");
  };

  return (
    <div className="space-y-3 relative">
      <div
        className={`flex items-center gap-3 ps-2 h-[50px] bg-white dark:bg-black rounded-xl border transition-all duration-200 ${
          isFocused
            ? "border-neutral-300 dark:border-neutral-600 shadow-lg shadow-neutral-100/50 dark:shadow-neutral-900/20 space:bg-green-600 space:border-green-700 space:shadow-green-900/20"
            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 space:bg-green-500 space:border-green-600"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 space:text-indigo-950 placeholder-neutral-500 dark:placeholder-neutral-400 space:placeholder:text-indigo-950 text-sm"
          placeholder="Lägg till en ny anteckning..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className={`p-2.5 bg-neutral-300 me-1 hover:bg-neutral-300/80 text-black rounded-lg transition-colors shadow-sm hover:shadow-md ${newTaskText.trim() === "" ? "bg-neutral-300 dark:bg-neutral-900 space:bg-green-700 cursor-not-allowed" : "bg-neutral-300 space:bg-green-950 space:text-white hover:bg-neutral-300/80"}`}
          onClick={handleAddTask}
          disabled={newTaskText.trim() === ""}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="hidden md:block text-xs text-neutral-500 dark:text-neutral-400 space:bg-indigo-950 text-center absolute right-14 top-1">
        <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-950 rounded text-xs space:bg-indigo-950 space:text-indigo-200">
          Ctrl+N
        </kbd>
      </div>
    </div>
  );
}
