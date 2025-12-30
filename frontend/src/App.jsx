import { useState, useEffect } from "react";
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
  } = useCategories();

  const { tasks, addTask, updateTask, toggleTaskCompletion, deleteTask } =
    useTasks(selectedCategory);

  const { getAllFonts, setDefaultFont, fontCss, fetchTheme } = useTheme();

  const { folders, updateFolder, deleteFolder, addFolder } = useFolders();


  const getCurrentCategory = () =>
    categories.find((c) => c._id === selectedCategory);

  const updateTaskOrder = async (_id, order) => {
    await window.electronAPI.invoke("update-tasks-order", _id, order);
  };

  return (
    <div
      className="flex h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-900"
      style={{ fontFamily: fontCss }}
    >
      <Sidebar
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
        fetchTheme={fetchTheme}
        addFolder={addFolder}
        updateFolder={updateFolder}
        deleteFolder={deleteFolder}
        folders={folders}
      />
      <TaskArea
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
