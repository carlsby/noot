import CategoryItem from "./CategoryItem";

export default function CategoryList({
  categories,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
}) {

  categories.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="flex-1 overflow-y-auto mb-4 h-full">
      <ul className="">
        {categories.map((category) => (
          <li key={category._id} className="group">
            <CategoryItem
              category={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              getTaskCount={getTaskCount}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
