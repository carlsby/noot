import { useState, useRef, useEffect } from "react";
import { Edit, Trash, GripVertical } from "lucide-react";
import { ConfirmModal } from "../shared/ConfirmModal";

export default function CategoryItem({
  category,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(category.name);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const categoryEditingRef = useRef(null);

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

    if (contextMenu.show) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu.show]);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event) => {
      if (
        categoryEditingRef.current &&
        !categoryEditingRef.current.contains(event.target)
      ) {
        if (editText.trim() === category?.name) {
          handleCancel();
        } else {
          handleSave();
        }
      }
    };

    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isEditing, handleSave]);

  const isSelected = selectedCategory === category._id;

  if (isEditing) {
    return (
      <div
        ref={categoryEditingRef}
        className="flex items-center gap-2 px-3 py-2.5"
      >
        <input
          type="text"
          className="flex-1 bg-transparent text-sm font-medium outline-none border-b border-primary"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
          placeholder="Category name"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={`group relative flex items-center px-1 gap-2 py-1.5 cursor-pointer transition-all ${
          isSelected
            ? "bg-white dark:bg-neutral-900 space:bg-green-500"
            : "hover:bg-gray-50/50 dark:hover:bg-neutral-800/20 space:bg-gray-900 space:hover:bg-green-950"
        }`}
        onContextMenu={handleContextMenu}
        onClick={() => setSelectedCategory(category._id)}
      >

        <GripVertical
          className="w-3 h-3 cursor-grab active:cursor-grabbing flex-shrink-0"
          style={{ color: category.color }}
        />
        
        <span
          className={`flex-1 text-sm font-medium truncate ${
            isSelected ? "text-primary" : "text-foreground"
          }`}
          title={category.name}
        >
          {category.name}
        </span>

        {contextMenu.show && (
          <div
            ref={contextMenuRef}
            className="absolute z-[70] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space:bg-indigo-950 space:border-indigo-900 shadow-2xl py-2 min-w-[150px] p-2 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y + 8}px`,
            }}
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40 space:text-green-400 space:hover:bg-green-900 transition-colors duration-150"
              onClick={handleEdit}
            >
              <Edit size={16} />
              Redigera
            </button>
            <div className="h-px bg-gray-100 dark:bg-neutral-800 mx-2 my-1 space:bg-green-900" />
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 space:hover:bg-red-700 space:hover:text-red-200 transition-colors duration-150"
              onClick={handleDelete}
            >
              <Trash size={16} />
              Radera
            </button>
          </div>
        )}
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
