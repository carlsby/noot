import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

export default function AddTaskForm({ addTask }) {
  const [newTaskText, setNewTaskText] = useState("");
  const [inputToggle, setInputToggle] = useState(false);

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
    <div className="flex items-center max-w-3xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:border-blue-500
            dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
            bg-gray-100 text-gray-900 placeholder-gray-500 h-[50px]
            transition-colors"
        placeholder="Lägg till uppgift..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <button
        className="ml-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 h-[50px] text-white rounded-lg flex items-center transition-colors"
        onClick={handleAddTask}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
