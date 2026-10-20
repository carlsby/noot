import { useCallback, useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import TaskArea from "./components/task/TaskArea";
import useTasks from "./hooks/useTasks";
import useTheme from "./hooks/useTheme";
import useCategories from "./hooks/useCategories";
import useFolders from "./hooks/useFolders";

export default function App() {
  const {
    addCategory,
    categories,
    selectedCategory,
    setSelectedCategory,
    moveCategoryToFolder,
    addCategoryToFolder,
    updateCategoryOrder,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories();

  const { tasks, addTask, updateTask, toggleTaskCompletion, deleteTask } =
    useTasks(selectedCategory);

  const { getAllFonts, setDefaultFont, fontCss, theme, changeTheme,
    noteFontSize, changeNoteFontSize, fontSizeSaving, fontSizeError } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("noot.sidebar.open") !== "false");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = Number(localStorage.getItem("noot.sidebar.width"));
    return Number.isFinite(stored) && stored >= 280 && stored <= 520 ? stored : 320;
  });

  useEffect(() => { localStorage.setItem("noot.sidebar.open", String(sidebarOpen)); }, [sidebarOpen]);
  useEffect(() => { localStorage.setItem("noot.sidebar.width", String(sidebarWidth)); }, [sidebarWidth]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        if (window.matchMedia("(max-width: 1023px)").matches) setMobileSidebarOpen((open) => !open);
        else setSidebarOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { folders, updateFolder, deleteFolder, addFolder } = useFolders();

  const handleDeleteFolder = async (id) => {
    if (folders.some((folder) => folder.parentId === id)) return false;
    await deleteFolder(id);
    await fetchCategories();
    return true;
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) setMobileSidebarOpen((open) => !open);
    else setSidebarOpen((open) => !open);
  };


  const getCurrentCategory = () =>
    categories.find((c) => c._id === selectedCategory);

  const updateTaskOrder = async (orderedTasks) => {
    await window.electronAPI.invoke("update-tasks-order", orderedTasks);
  };

  return (
    <div className="app-shell" style={{ "--note-font-size": `${noteFontSize}px` }}>
      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        onToggle={toggleSidebar}
        width={sidebarWidth}
        onWidthChange={setSidebarWidth}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        moveCategoryToFolder={moveCategoryToFolder}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        addCategoryToFolder={addCategoryToFolder}
        updateCategoryOrder={updateCategoryOrder}
        addCategory={addCategory}
        getAllFonts={getAllFonts}
        fontCss={fontCss}
        setDefaultFont={setDefaultFont}
        theme={theme}
        changeTheme={changeTheme}
        noteFontSize={noteFontSize}
        changeNoteFontSize={changeNoteFontSize}
        fontSizeSaving={fontSizeSaving}
        fontSizeError={fontSizeError}
        addFolder={addFolder}
        updateFolder={updateFolder}
        deleteFolder={handleDeleteFolder}
        folders={folders}
      />
      <TaskArea
        onToggleSidebar={toggleSidebar}
        currentCategory={getCurrentCategory()}
        filteredTasks={tasks}
        addTask={addTask}
        updateTask={updateTask}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        updateTaskOrder={updateTaskOrder}
      />
    </div>
  );
}
