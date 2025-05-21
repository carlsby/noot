import { useState } from "react";
import { Check, Edit, Trash, Save, X, List, Menu } from "lucide-react";

export default function TaskItem({
  task,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  dragHandleProps,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() === "") return;
    updateTask(task._id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className="flex items-center p-2 rounded-xl border border-purple-500 shadow-sm
                    dark:bg-gray-800 bg-white"
      >
        <input
          type="text"
          className="flex-1 px-2 py-1 focus:outline-none
                    dark:bg-gray-800 dark:text-white bg-white text-gray-900"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <button
          className="ml-2 text-purple-500 hover:text-purple-600"
          onClick={handleSave}
        >
          <Save size={18} />
        </button>
        <button
          className="ml-2 text-gray-500 hover:text-gray-600"
          onClick={handleCancel}
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center p-2 rounded-xl border transition-all 
              ${task.completed ? "opacity-60" : ""} 
              dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600
              bg-white border-gray-200 hover:border-gray-300`}
    >
      <div
        {...dragHandleProps}
        className="
    cursor-move p-1 mr-2 text-gray-500 
    opacity-0 w-0 overflow-hidden pointer-events-none
    group-hover:opacity-100 group-hover:w-6 group-hover:pointer-events-auto
    transition-all duration-300 ease-in-out
  "
        aria-label="Drag handle"
      >
        <Menu size={14} />
      </div>

      <button
        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
          task.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-400 hover:border-green-500"
        }`}
        onClick={() => toggleTaskCompletion(task._id)}
      >
        {task.completed && <Check size={14} />}
      </button>
      <span
        className={`flex-1 ps-4 cursor-pointer ${
          task.completed
            ? "line-through text-gray-500 dark:text-gray-500"
            : "text-gray-900 dark:text-white"
        }`}
        onClick={() => toggleTaskCompletion(task._id)}
      >
        {task.text}
      </span>
      <div className="hidden group-hover:flex">
        <button
          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-purple-500 p-1"
          onClick={() => setIsEditing(true)}
        >
          <Edit size={16} />
        </button>
        <button
          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-red-500 p-1"
          onClick={() => deleteTask(task._id)}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}
