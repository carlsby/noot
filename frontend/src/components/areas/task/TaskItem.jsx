import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
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
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const textareaRef = useRef(null);
  const editContainerRef = useRef(null);
  const contextMenuRef = useRef(null);

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editText, isEditing]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, editText]);

  const handleContextMenu = (e) => {
    e.preventDefault();

    const menuWidth = 180;
    const menuHeight = 120;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }

    setContextMenu({ show: true, x, y });
  };

  const closeContextMenu = () => setContextMenu({ show: false, x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };
    if (contextMenu.show) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu.show]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      const len = el.value.length;

      el.focus();
      el.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // för ta bort modalen
  const truncated =
    task.text.length > 40 ? task.text.slice(0, 40) + "..." : task.text;

  return (
    <>
      {isEditing ? (
        <div
          ref={editContainerRef}
          className="bg-white dark:bg-neutral-900/60 p-3 shadow-sm transition-all border border-neutral-400 dark:border-neutral-700"
        >
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-2 flex-shrink-0 items-center">
              <div className="opacity-30 group-hover:opacity-60">
                <GripVertical size={16} className="text-neutral-400" />
              </div>
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 text-sm placeholder-neutral-400 p-1"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
              placeholder="Skriv din anteckning..."
            />
          </div>
        </div>
      ) : (
        <div
          {...dragHandleProps}
          className={`group bg-white dark:bg-neutral-900/60 p-3 border border-transparent hover:border-neutral-400 dark:hover:border-neutral-800 transition-all duration-200 cursor-grab active:cursor-grabbing ${
            task.completed ? "opacity-40 line-through" : ""
          } ${
            isDragging
              ? "shadow-lg border-neutral-400 dark:border-neutral-600"
              : "hover:shadow-sm"
          }`}
          onDoubleClick={() => setEditingTaskId(task._id)}
          onContextMenu={handleContextMenu}
        >
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-2 flex-shrink-0 items-center">
              <div className="opacity-30 group-hover:opacity-60">
                <GripVertical size={16} className="text-neutral-400" />
              </div>
            </div>

            <span className="flex-1 text-sm whitespace-pre-line text-neutral-900 dark:text-neutral-100">
              {task.text}
            </span>
          </div>

          {contextMenu.show && (
            <div
              ref={contextMenuRef}
              className="absolute z-[70] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl py-2 min-w-[160px] p-2"
              style={{ left: contextMenu.x + "px", top: contextMenu.y + "px" }}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={() => {
                  toggleTaskCompletion(task._id);
                  closeContextMenu();
                }}
              >
                {task.completed ? "Markera som ofärdig" : "Markera som färdig"}
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  setShowConfirm(true);
                  closeContextMenu();
                }}
              >
                Radera
              </button>
            </div>
          )}
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message={`Är du säker på att du vill ta bort anteckningen "${truncated}"?`}
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
