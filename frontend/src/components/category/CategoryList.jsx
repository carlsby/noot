import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FolderPlus, Folder } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import FolderItem from "../folder/FolderItem";
import CategoryItem from "./CategoryItem";

export default function CategoryList({
  folders,
  categories,
  moveCategoryToFolder,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  updateFolder,
  deleteFolder,
  addFolder,
  updateCategoryOrder,
  addCategoryToFolder,
}) {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // auto-expand folder when a category inside it is selected
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;

    const fullCategory = categories.find(
      (cat) =>
        cat._id === selectedCategory ||
        (typeof selectedCategory === "object" &&
          cat._id === selectedCategory._id)
    );

    if (fullCategory?.folderId) {
      const folderIdStr = String(fullCategory.folderId);
      setExpandedFolders((prev) =>
        prev.includes(folderIdStr) ? prev : [...prev, folderIdStr]
      );
    }
  }, [selectedCategory, categories]);

  const toggleFolder = useCallback((id) => {
    const idStr = String(id);
    setExpandedFolders((prev) =>
      prev.includes(idStr)
        ? prev.filter((fId) => fId !== idStr)
        : [...prev, idStr]
    );
  }, []);

  // get sorted categories for folder, if null its root
  const categoriesInFolder = useCallback(
    (folderId) =>
      localCategories
        .filter((c) => c.folderId === folderId)
        .sort((a, b) => a.order - b.order),
    [localCategories]
  );

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceFolderId =
      source.droppableId === "root" ? null : source.droppableId;
    const destFolderId =
      destination.droppableId === "root" ? null : destination.droppableId;

    if (sourceFolderId === destFolderId && source.index === destination.index)
      return;

    const newCategories = [...localCategories];
    const dragged = newCategories.find((c) => c._id === draggableId);
    if (!dragged) return;

    dragged.folderId = destFolderId;

    // remove from old pos
    const filtered = newCategories.filter((c) => c._id !== draggableId);

    // Get destination list and insert it
    const destCategories = filtered
      .filter((c) => c.folderId === destFolderId)
      .sort((a, b) => a.order - b.order);

    destCategories.splice(destination.index, 0, dragged);

    // reassign order
    destCategories.forEach((cat, idx) => {
      cat.order = idx;
    });

    // merge back
    const updatedCategories = [
      ...filtered.filter((c) => c.folderId !== destFolderId),
      ...destCategories,
    ];

    setLocalCategories(updatedCategories);

    // update backend
    moveCategoryToFolder(draggableId, destFolderId);
    updateCategoryOrder(
      destCategories.map((c) => ({ _id: c._id, order: c.order }))
    );
  };

  const handleCreateFolder = () => setIsCreatingFolder(true);

  const handleSaveNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    await addFolder(name);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const handleCancelNewFolder = () => {
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const rootCategories = categoriesInFolder(null);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="px-2 py-4 space-y-1">
        <div
          className={`flex items-center justify-end mb-2 -mt-2 transition-opacity ${
            isCreatingFolder ? "opacity-100" : "opacity-0 hover:opacity-100"
          }`}
        >
          {isCreatingFolder ? (
            <div className="flex-1 flex items-center gap-2 px-2 py-1.5 bg-accent/30 rounded-md">
              <Folder className="w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveNewFolder();
                  if (e.key === "Escape") handleCancelNewFolder();
                }}
                onBlur={handleCancelNewFolder}
                className="flex-1 bg-transparent text-sm font-medium outline-none border-b border-primary text-black dark:text-white"
                autoFocus
                placeholder="Mappnamn"
              />
            </div>
          ) : (
            <FolderPlus
              onClick={handleCreateFolder}
              className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-100"
            />
          )}
        </div>

        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            categories={categoriesInFolder(folder._id)}
            expanded={expandedFolders.includes(String(folder._id))}
            toggle={toggleFolder}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            getTaskCount={getTaskCount}
            updateFolder={updateFolder}
            deleteFolder={deleteFolder}
            addCategoryToFolder={addCategoryToFolder}
          />
        ))}

        <Droppable droppableId="root">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[40px] transition-colors ${
                snapshot.isDraggingOver
                  ? "bg-gray-200 dark:bg-neutral-900/60 border border-dashed border-gray-400 dark:border-neutral-800"
                  : "border border-transparent"
              }`}
            >
              {rootCategories.map((cat, index) => (
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
