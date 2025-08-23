import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  Circle,
  Edit,
  Trash,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { ConfirmModal } from "../../shared/ConfirmModal";

export default function TaskItem({
  task,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  dragHandleProps,
  editingTaskId,
  setEditingTaskId,
  isDragging = false,
}) {
  const isEditing = editingTaskId === task._id;
  const [editText, setEditText] = useState(task.text);
  const [showConfirm, setShowConfirm] = useState(false);

  const editContainerRef = useRef(null);

  const handleSave = () => {
    if (editText.trim() === "") return;
    updateTask(task._id, editText);
    setEditingTaskId(null);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditingTaskId(null);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event) => {
      if (
        editContainerRef.current &&
        !editContainerRef.current.contains(event.target)
      ) {
        handleSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editText]);

  if (isEditing) {
    return (
      <div
        ref={editContainerRef}
        className="bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space:bg-green-600 space:border-green-700 p-1 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleTaskCompletion(task._id);
              setEditingTaskId(null);
            }}
            className="flex-shrink-0 text-neutral-400 hover:text-emerald-500 transition-colors"
            title={task.completed ? "Gör ofärdig" : "Markera som färdig"}
          >
            {task.completed ? (
              <CheckCircle size={20} className="text-emerald-500 space:text-indigo-950/40" />
            ) : (
              <Circle className="space:text-indigo-950" size={20} />
            )}
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            placeholder="Skriv din anteckning..."
          />

          <div className="flex items-center gap-1">
            <button
              className="p-2 text-neutral-400 hover:text-black dark:hover-text-white hover:bg-neutral-300 dark:hover:bg-neutral-900/20 space:text-indigo-950 hover:space:bg-indigo-900 hover:space:text-white rounded-lg transition-colors"
              onClick={handleSave}
              title="Spara"
            >
              <Save size={16} />
            </button>
            <button
              className="p-2 text-neutral-400 hover:text-black dark:hover-text-white hover:bg-neutral-300 dark:hover:bg-neutral-900/20 space:text-indigo-950 hover:space:bg-gray-950 hover:space:text-white rounded-lg transition-colors"
              onClick={handleCancel}
              title="Avbryt"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        {...dragHandleProps}
        className={`group bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1 hover:border-neutral-300 dark:hover:border-neutral-600 space:bg-green-500 space:border-green-600 transition-all duration-200 cursor-grab active:cursor-grabbing ${
          task.completed ? "opacity-60" : ""
        } ${
          isDragging
            ? "shadow-lg border-neutral-300 dark:border-neutral-600"
            : "hover:shadow-sm"
        }`}
      >
        <div
          className="flex items-center gap-3"
          title="Flytta genom dra och släpp"
        >
          <div className="flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity">
            <GripVertical size={16} className="text-neutral-400 space:text-indigo-950" />
          </div>

          <button
            onClick={() => toggleTaskCompletion(task._id)}
            className="flex-shrink-0 text-neutral-400 hover:text-emerald-500 transition-colors"
            title={
              task.completed ? "Markera som ofärdig" : "Markera som färdig"
            }
          >
            {task.completed ? (
              <CheckCircle size={20} className="text-emerald-500 space:text-indigo-950/40" />
            ) : (
              <Circle className="space:text-indigo-950" size={20} />
            )}
          </button>

          <span
            onDoubleClick={() => setEditingTaskId(task._id)}
            title="Dubbelklicka för att redigera"
            className={`flex-1 cursor-pointer text-sm transition-colors ${
              task.completed
                ? "line-through text-neutral-500 space:text-indigo-950/40"
                : "text-neutral-900 dark:text-neutral-100 space:text-indigo-950"
            }`}
          >
            {task.text}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 space:bg-red-900 space:text-red-400 space:hover:bg-red-950 rounded-lg transition-colors"
              onClick={() => setShowConfirm(true)}
              title="Radera"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          message={`Är du säker på att du vill ta bort anteckningen "${task.text}"?`}
          onConfirm={() => {
            deleteTask(task._id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
