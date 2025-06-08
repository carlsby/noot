import { useState } from "react";
import { Edit, Trash, Save, X, NotebookPen } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

export default function CategoryItem({
  category,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  setCodeMode,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(category.name);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (editText.trim() === "") return;
    updateCategory(category._id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(category.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center p-1">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-[#381D5C] focus:outline-none
                    dark:bg-gray-800 dark:text-white bg-white text-gray-900"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <button
          className="ml-2 text-[#381D5C] hover:text-[#402169]"
          onClick={handleSave}
        >
          <Save size={16} />
        </button>
        <button
          className="ml-1 text-gray-500 hover:text-gray-600"
          onClick={handleCancel}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex items-center p-2 ${
          selectedCategory === category._id
            ? "dark:bg-gray-800 bg-white shadow-sm"
            : "dark:hover:bg-gray-800/50 hover:bg-white/50 transition-all"
        }`}
      >
        <button
          className="flex items-center flex-1 rounded-lg text-left gap-2"
          onClick={() => {
            setSelectedCategory(category._id);
            setCodeMode(false);
          }}
        >
          <NotebookPen style={{ color: category.color }} size={18} />
          <div className="relative group max-w-[170px] overflow-hidden">
            <span
              className={`
                          block
                          truncate
                          whitespace-nowrap
                          overflow-hidden
                          text-sm
                          ${selectedCategory === category._id ? "font-medium" : ""}
                          dark:text-white text-gray-900
                        `}
              title={category.name}
            >
              {category.name}
            </span>
          </div>

          <span
            className={`ml-auto px-2 rounded-full text-xs ${
              selectedCategory === category._id
                ? "bg-[#381D5C] text-white"
                : "dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-600"
            }`}
          >
            {getTaskCount(category._id)}
          </span>
        </button>
        <div className="hidden group-hover:flex transition-all">
          <button
            className="ml-1 text-gray-500 hover:text-black dark:hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit size={14} />
          </button>
          <button
            className="ml-1 text-gray-500 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          message={`Är du säker på att du vill ta bort kategorin "${category.name}"?`}
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
