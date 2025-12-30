import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Folder,
  Edit,
  Trash,
  File,
  FilePlus,
} from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CategoryItem from "../category/CategoryItem";
import { ConfirmModal } from "../shared/ConfirmModal";

export default function FolderItem({
  folder,
  categories,
  expanded,
  toggle,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  updateFolder,
  deleteFolder,
  addCategoryToFolder,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(folder.name);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [showConfirm, setShowConfirm] = useState(false);
  const contextMenuRef = useRef(null);
  const folderEditingRef = useRef(null);

  const handleSave = () => {
    if (editText.trim()) {
      updateFolder(folder._id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(folder.name);
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
        folderEditingRef.current &&
        !folderEditingRef.current.contains(event.target)
      ) {
        handleCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleCreateCategory = () => setIsCreatingCategory(true);
  const handleSaveNewCategory = async () => {
    await addCategoryToFolder(newCategoryName.trim(), folder._id);
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };
  const handleCancelNewCategory = () => {
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  return (
    <>
      <div className="mb-1 relative">
        {isEditing ? (
          <div
            ref={folderEditingRef}
            className="flex items-center gap-2 px-2 py-2 bg-accent/30 rounded-md"
          >
            <Folder className="w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="flex-1 bg-transparent text-sm font-medium outline-none border-b border-primary"
              autoFocus
              placeholder="Mappnamn"
            />
          </div>
        ) : (
          <button
            onClick={() => toggle(folder._id)}
            onContextMenu={handleContextMenu}
            className="flex items-center gap-2 w-full px-1 py-1 rounded-md hover:bg-accent/50 transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
            <span className="text-base font-medium flex-1 text-left truncate">
              {folder.name}
            </span>
            {expanded && (
              <div>
                {!isCreatingCategory && (
                  <FilePlus
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCreateCategory();
                    }}
                    className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-100"
                  />
                )}
              </div>
            )}
          </button>
        )}

        {expanded && (
          <Droppable droppableId={folder._id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`ml-6 relative min-h-[40px] pl-2 ${
                  categories.length > 0
                    ? "border-l border-gray-300 dark:border-neutral-800"
                    : ""
                } ${
                  snapshot.isDraggingOver
                    ? "bg-gray-200 dark:bg-neutral-900/60 border border-gray-400 dark:border-neutral-800 border-dashed"
                    : ""
                }`}
              >
                {categories.map((cat, index) => (
                  <Draggable key={cat._id} draggableId={cat._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "opacity-50" : ""}
                      >
                        <CategoryItem
                          category={cat}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          updateCategory={updateCategory}
                          deleteCategory={deleteCategory}
                          getTaskCount={getTaskCount}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {isCreatingCategory ? (
                  <div className="flex-1 flex items-center gap-2 px-1 py-1.5 bg-accent/30 rounded-md">
                    <File className="w-3 h-3 flex-shrink-0" />
                    <input
                      type="text"
                      className="flex-1 bg-transparent text-sm font-medium outline-none border-b text-black dark:text-white"
                      autoFocus
                      placeholder="Kategorinamn"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveNewCategory();
                        if (e.key === "Escape") handleCancelNewCategory();
                      }}
                      onBlur={handleCancelNewCategory}
                    />
                  </div>
                ) : (
                  ""
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}

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
          message={`Vill du radera mappen "${folder.name}"? Kategorierna flyttas till roten.`}
          onConfirm={() => {
            deleteFolder(folder._id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
