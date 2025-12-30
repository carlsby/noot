import FolderList from "../../folder/FolderList";

export default function SidebarContent({
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
  return (
    <div className="flex-1 overflow-y-auto">
      <FolderList
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
    </div>
  );
}
