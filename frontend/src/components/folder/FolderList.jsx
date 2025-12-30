import { DragDropContext } from "@hello-pangea/dnd";
import CategoryList from "../category/CategoryList";

export default function FolderList({
  categories,
  selectedCategory,
  setSelectedCategory,
  onSelect,
  folders,
  moveCategoryToFolder,
  updateCategory,
  deleteCategory,
  updateFolder,
  deleteFolder,
  addCategoryToFolder,
  updateCategoryOrder,
  addFolder
}) {
  const handleDragEnd = (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;

    const sourceFolderId =
      source.droppableId === "root" ? null : source.droppableId;
    const destFolderId =
      destination.droppableId === "root" ? null : destination.droppableId;

    if (sourceFolderId === destFolderId && source.index === destination.index)
      return;

    moveCategoryToFolder(draggableId, destFolderId);
    updateCategoryOrder?.(draggableId, source, destination);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={(id) => {
          setSelectedCategory(id);
          onSelect?.();
        }}
        folders={folders}
        moveCategoryToFolder={moveCategoryToFolder}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        updateFolder={updateFolder}
        deleteFolder={deleteFolder}
        addCategoryToFolder={addCategoryToFolder}
        updateCategoryOrder={updateCategoryOrder}
        addFolder={addFolder}
      />
    </DragDropContext>
  );
}
