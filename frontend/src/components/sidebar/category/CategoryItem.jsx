import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash,
  Save,
  X,
  Notebook,
  PenTool,
  NotepadText,
} from "lucide-react";
import { ConfirmModal } from "../../shared/ConfirmModal";

export default function CategoryItem({
  category,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(category.name);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const contextMenuRef = useRef(null);

  const handleSave = () => {
    if (editText.trim() === "") return;
    updateCategory(category._id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(category.name);
    setIsEditing(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(e.clientX - rect.left, rect.width - 160);
    const y = e.clientY - rect.top;

    setContextMenu({ show: true, x, y });
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleEdit = () => {
    setIsEditing(true);
    closeContextMenu();
  };

  const handleDelete = () => {
    setShowConfirm(true);
    closeContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    const handleScroll = () => closeContextMenu();

    if (contextMenu.show) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [contextMenu.show]);

  const isSelected = selectedCategory === category._id;

  if (isEditing) {
    return (
      <div>
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-950 h-[50px]">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <input
            type="text"
            className="min-w-0 flex-1 bg-transparent text-gray-900 dark:text-gray-100 text-sm font-medium border-none outline-none placeholder-gray-400"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            placeholder="Anteckningsnamn"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 rounded-xl transition-all duration-200"
              onClick={handleSave}
            >
              <Save size={14} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              onClick={handleCancel}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div
          className={`group relative ${
            isSelected
              ? "bg-white/60 dark:bg-neutral-900 shadow-sm"
              : "hover:bg-gray-50/50 dark:hover:bg-neutral-800/20"
          }`}
          onContextMenu={handleContextMenu}
        >
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left relative h-[50px]"
            onClick={() => {
              setSelectedCategory(category._id);
            }}
          >
            <NotepadText
              className={`w-4 h-4 transition-all duration-200 ${
                isSelected ? "scale-110 shadow-sm" : ""
              }`}
              style={{ color: category.color }}
            />

            <span
              className={`flex-1 text-sm font-medium truncate transition-all duration-200 ${
                isSelected
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              title={category.name}
            >
              {category.name}
            </span>

            <span
              className={`text-xs font-medium h-5 w-5 flex justify-center items-center rounded-full transition-all duration-200 ${
                isSelected
                  ? `text-gray-600 dark:text-gray-400 bg-neutral-300 dark:bg-neutral-700`
                  : "text-gray-500 dark:text-gray-400 bg-neutral-200 dark:bg-neutral-800"
              }`}
            >
              {getTaskCount(category._id)}
            </span>
          </button>

          {contextMenu.show && (
            <div
              ref={contextMenuRef}
              className="absolute z-[70] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-2xl py-2 min-w-[150px] p-2 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200"
              style={{
                left: `${contextMenu.x}px`,
                top: `${contextMenu.y + 8}px`,
              }}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-md dark:hover:bg-gray-800/40 transition-colors duration-150"
                onClick={handleEdit}
              >
                <Edit size={16} />
                Redigera
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-800 mx-2 my-1" />
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 rounded-md dark:hover:bg-red-900/10 transition-colors duration-150"
                onClick={handleDelete}
              >
                <Trash size={16} />
                Radera
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={`Är du säker på att du vill radera "${category.name}"?`}
          onConfirm={() => {
            deleteCategory(category._id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
