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
    <div className="flex items-center max-w-3xl">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 px-3 py-2 text-sm rounded-lg border border-transparent focus:outline-none focus:border-[#381D5C]
            dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
            bg-gray-100 text-gray-900 placeholder-gray-500 h-[35px]
            transition-colors"
        placeholder="Lägg till uppgift..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <button
        className="ml-3 px-2 py-2 bg-[#381D5C] hover:bg-[#402169] h-[35px] text-white rounded-lg flex items-center transition-colors"
        onClick={handleAddTask}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
