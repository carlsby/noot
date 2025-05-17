import { useState } from "react";
import { Plus } from "lucide-react";

export default function AddCategoryForm({ addCategory }) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    addCategory(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500 text-sm
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400
                  bg-white border-gray-200 text-gray-900 placeholder-gray-500
                  transition-colors"
        placeholder="Ny kategori"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
      />
      <button
        className="ml-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
        onClick={handleAddCategory}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
