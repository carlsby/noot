import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FolderPlus, Folder } from "lucide-react";
import { useEffect, useState } from "react";
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
  addCategoryToFolder
}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(
    () => setExpandedFolders(new Set(folders.map((f) => f._id))),
    [folders]
  );

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const categoriesInFolder = (folderId) =>
    localCategories
      .filter((c) => c.folderId === folderId)
      .sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceFolderId =
      source.droppableId === "root" ? null : source.droppableId;
    const destFolderId =
      destination.droppableId === "root" ? null : destination.droppableId;

    if (sourceFolderId === destFolderId && source.index === destination.index)
      return;

    // clone categories
    let newCategories = [...localCategories];

    // move the dragged category
    const dragged = newCategories.find((c) => c._id === draggableId);
    dragged.folderId = destFolderId;

    // remove from old position
    newCategories = newCategories.filter((c) => c._id !== draggableId);

    // get categories in destination folder and insert at correct index
    const destCategories = newCategories
      .filter((c) => c.folderId === destFolderId)
      .sort((a, b) => a.order - b.order);

    destCategories.splice(destination.index, 0, dragged);

    // recompute order for all categories in destination folder
    destCategories.forEach((c, i) => (c.order = i));

    // merge back other categories
    newCategories = [
      ...newCategories.filter((c) => c.folderId !== destFolderId),
      ...destCategories,
    ];

    // update local state immediately — **do not call fetchData**
    setLocalCategories(newCategories);

    // update backend in background
    moveCategoryToFolder(draggableId, destFolderId);
    updateCategoryOrder(
      destCategories.map((c) => ({ _id: c._id, order: c.order }))
    );
  };

  const handleCreateFolder = () => setIsCreatingFolder(true);
  const handleSaveNewFolder = async () => {
    if (!newFolderName.trim()) return;
    await addFolder(newFolderName.trim());
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
          className={`flex items-center justify-end mb-2 -mt-2 ${
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
                className="flex-1 bg-transparent text-sm font-medium outline-none border-b text-black dark:text-white"
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
            expanded={expandedFolders.has(folder._id)}
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
              className={`min-h-[40px] border border-transparent transition-colors ${
                snapshot.isDraggingOver
                    ? "bg-gray-200 dark:bg-neutral-900/60 border border-gray-400 dark:border-neutral-800 border-dashed"
                  : ""
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
