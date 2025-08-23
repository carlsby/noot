import { useState } from "react";
import { Plus, NotepadText, Paintbrush } from "lucide-react";

export default function AddPaintForm({ addPainting }) {
  const [newPaintingName, setNewPaintingName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAddPainting = () => {
    if (newPaintingName.trim() === "") return;
    addPainting(newPaintingName);
    setNewPaintingName("");
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 h-[50px] bg-neutral-50 dark:bg-black rounded-xl border transition-all duration-200 ${
        isFocused
          ? "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-black space:bg-green-600 space:border-green-700"
          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 space:bg-green-500 space:border-green-500"
      }`}
    >
      <div className="flex-shrink-0">
        <NotepadText size={16} className="text-neutral-400 space:text-indigo-950" />
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 space:text-indigo-950 space:placeholder:text-indigo-950 text-sm"
        placeholder="Ny målning"
        value={newPaintingName}
        onChange={(e) => setNewPaintingName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddPainting()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className={`p-2  text-black rounded-lg transition-colors shadow-sm ${newPaintingName.trim() === "" ? "bg-neutral-300 dark:bg-neutral-900 space:bg-green-700 cursor-not-allowed" : "bg-neutral-300 hover:bg-neutral-300/80 space:bg-green-950 space:text-white"}`}
        onClick={handleAddPainting}
        disabled={newPaintingName.trim() === ""}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
