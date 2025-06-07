import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Edit,
  Trash,
  Save,
  X,
  List,
  Menu,
  GripVertical,
  Asterisk,
  Minus,
} from "lucide-react";

export default function TaskItem({
  task,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  dragHandleProps,
  editingTaskId,
  setEditingTaskId,
}) {
  const isEditing = editingTaskId === task._id;
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() === "") return;
    updateTask(task._id, editText);
    setEditingTaskId(null);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditingTaskId(null);
  };

  if (isEditing) {
    return (
      <div className="flex items-center border-b border-gray-500 py-1 shadow-sm text-sm">
        <div className="flex items-center px-2">
          <button
            onClick={() => {
              toggleTaskCompletion(task._id);
              setEditingTaskId(null);
            }}
            className="text-gray-500 hover:text-black dark:hover:text-white"
            title={task.completed ? "Undo complete" : "Mark complete"}
          >
            {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
          </button>
        </div>

        <input
          type="text"
          className="flex-1 focus:outline-none dark:bg-gray-900 dark:text-white bg-white text-gray-900"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
        />
        <div className="flex items-center pe-2">
          <button
            className="ml-2 text-gray-500 hover:text-black dark:hover:text-white"
            onClick={handleSave}
          >
            <Save size={18} />
          </button>
          <button
            className="ml-2 text-gray-500 hover:text-black dark:hover:text-white"
            onClick={handleCancel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...dragHandleProps}
      className={`group flex items-center py-1 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 text-sm bg-transparent ${
        task.completed ? "opacity-60" : ""
      }`}
      aria-label="Drag handle"
    >
      <div className="flex items-center px-2 opacity-40 group-hover:opacity-70 transition-opacity">
        <Minus size={16} className="text-gray-400" />
      </div>

      <span
        onDoubleClick={() => setEditingTaskId(task._id)}
        title="Double-click to edit"
        className={`flex-1 cursor-pointer ${
          task.completed
            ? "line-through text-gray-500 dark:text-gray-500"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {task.text}
      </span>

      <div className="hidden group-hover:flex items-center pe-1">
        <button
          className="ml-1 text-gray-500 hover:text-red-800 dark:hover:text-red-500"
          onClick={() => deleteTask(task._id)}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}
