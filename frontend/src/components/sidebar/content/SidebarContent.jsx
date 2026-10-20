import { useEffect, useState } from "react";
import FolderList from "../../folder/FolderList";
import SearchBar from "../SearchBar";
import { getPlainTextFromRichHtml } from "../../../utils/richText";

export default function SidebarContent({
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => { if (rootCreateType) setQuery(""); }, [rootCreateType]);

  useEffect(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return;
    let active = true;
    const timer = setTimeout(async () => {
      const tasks = await window.electronAPI.invoke("get-tasks");
      if (!active) return;
      const found = categories.map((category) => {
        const note = tasks.find((task) => task.categoryId === category._id && getPlainTextFromRichHtml(task.text).toLocaleLowerCase().includes(search));
        if (!category.name.toLocaleLowerCase().includes(search) && !note) return null;
        return { category, excerpt: note ? getPlainTextFromRichHtml(note.text).slice(0, 90) : "" };
      }).filter(Boolean);
      setResults(found);
    }, 160);
    return () => { active = false; clearTimeout(timer); };
  }, [query, categories]);

  return (
    <div className="sidebar-content">
      <SearchBar searchQuery={query} setSearchQuery={setQuery} />
      <div className="sidebar-section-label">Filer</div>
      {query.trim() ? (
        <div className="sidebar-search-results">
          {results.length ? results.map(({ category, excerpt }) => (
            <button key={category._id} type="button" onClick={() => { setSelectedCategory(category._id); onSelect?.(); }}
              className={selectedCategory === category._id ? "selected" : ""}>
              <strong>{category.name}</strong>{excerpt && <span>{excerpt}</span>}
            </button>
          )) : <p>Inga träffar</p>}
        </div>
      ) : (
      <FolderList
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
      )}
    </div>
  );
}
