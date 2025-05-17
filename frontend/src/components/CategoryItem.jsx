import { useState } from "react";
import { Edit, Trash, Save, X } from "lucide-react";

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

  console.log(category)

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
          className="flex-1 px-3 py-2 rounded-lg border border-blue-500 focus:outline-none
                    dark:bg-gray-800 dark:text-white bg-white text-gray-900"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <button
          className="ml-2 text-blue-500 hover:text-blue-600"
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
    <div className="flex items-center">
      <button
        className={`flex items-center flex-1 px-3 py-2 rounded-lg text-left transition-all
                  ${
                    selectedCategory === category._id
                      ? "dark:bg-gray-800 bg-white shadow-sm"
                      : "dark:hover:bg-gray-800/50 hover:bg-white/50"
                  }`}
        onClick={() => setSelectedCategory(category._id)}
      >
        <div
          className="w-3 h-3 rounded-full mr-3"
          style={{ backgroundColor: category.color }}
        ></div>
        <span
          className={`${
            selectedCategory === category._id ? "font-medium" : ""
          } dark:text-white`}
        >
          {category.name}
        </span>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
            selectedCategory === category._id
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-600"
          }`}
        >
          {getTaskCount(category._id)}
        </span>
      </button>
      <div className="hidden group-hover:flex pr-2">
        <button
          className="ml-1 text-gray-500 hover:text-gray-600 p-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Edit size={14} />
        </button>
        <button
          className="ml-1 text-gray-500 hover:text-red-500 p-1"
          onClick={(e) => {
            e.stopPropagation();
            deleteCategory(category._id);
          }}
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}
