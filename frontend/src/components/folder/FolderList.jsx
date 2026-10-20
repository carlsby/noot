import CategoryList from "../category/CategoryList";

export default function FolderList({
  categories,
  addCategory,
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
  addFolder,
  rootCreateType,
  setRootCreateType,
}) {
  return (
      <CategoryList
        categories={categories}
        addCategory={addCategory}
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
        rootCreateType={rootCreateType}
        setRootCreateType={setRootCreateType}
      />
  );
}
