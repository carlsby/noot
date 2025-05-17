// import SearchBar from "./SearchBar";
import CategoryList from "./CategoryList";
import AddCategoryForm from "./AddCategoryForm";
import DarkModeToggle from "./DarkModeToggle";

export default function Sidebar({
  darkMode,
  toggleDarkMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  // searchQuery,
  // setSearchQuery,
  addCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
}) {
  return (
    <div
      className="w-72 p-4 flex flex-col border-r transition-colors duration-300
                  dark:bg-gray-900 dark:border-gray-700 
                  bg-gray-100 border-gray-200 overflow-hidden"
    >
      {/* <div className="mb-6 mt-2">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div> */}

      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Kategorier
        </h2>
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        getTaskCount={getTaskCount}
      />

      <div className="mt-auto">
        <AddCategoryForm addCategory={addCategory} />
      </div>
    </div>
  );
}
