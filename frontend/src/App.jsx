import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import TaskArea from "./components/areas/task/TaskArea";
import PaintArea from "./components/areas/paint/PaintArea";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paintMode, setPaintMode] = useState(false);

  useEffect(() => {
    fetchData();
    loadSelectedCategory();
  }, []);

  async function fetchData() {
    const cats = await window.electronAPI.invoke("get-categories");
    const tks = await window.electronAPI.invoke("get-tasks");
    const pts = await window.electronAPI.invoke("get-paintings");

    setPaintings(pts);
    setCategories(cats);
    setTasks(tks);
  }

  async function loadSelectedCategory() {
    const savedCategoryId = await window.electronAPI.invoke(
      "get-selected-category"
    );
    if (savedCategoryId) {
      const cats = await window.electronAPI.invoke("get-categories");
      const exists = cats.some((cat) => cat._id === savedCategoryId);
      if (exists) {
        setSelectedCategory(savedCategoryId);
      } else {
        await window.electronAPI.invoke("clear-selected-category");
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(null);
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      window.electronAPI.invoke("set-selected-category", selectedCategory);
    }
  }, [selectedCategory]);

  // Lägg till kategori via ipc
  const addCategory = async (name) => {
    const addedCategory = await window.electronAPI.invoke("add-category", name);
    if (addedCategory) {
      setSelectedCategory(addedCategory._id);
      await fetchData();
    }
  };

  // Uppdatera kategori via ipc
  const updateCategory = async (id, name) => {
    const updatedCat = await window.electronAPI.invoke("update-category", {
      id,
      name,
    });
    if (updatedCat) {
      await fetchData();
    }
  };

  // Radera kategori via ipc
  const deleteCategory = async (id) => {
    const deletedCategory = await window.electronAPI.invoke(
      "delete-category",
      id
    );
    if (deletedCategory) {
      const cats = await window.electronAPI.invoke("get-categories");
      const tks = await window.electronAPI.invoke("get-tasks");
      setCategories(cats);
      setTasks(tks);

      if (selectedCategory === id) {
        await window.electronAPI.invoke("clear-selected-category");
        if (cats.length > 0) {
          setSelectedCategory(cats[0]._id);
        } else {
          setSelectedCategory(null);
        }
      }
    }
  };

  // Lägg till uppgift via ipc
  const addTask = async (text) => {
    if (!text.trim()) return;

    if (!selectedCategory) {
      let currentDate = new Date().toJSON().slice(0, 10);
      const newCategory = await window.electronAPI.invoke(
        "add-category",
        currentDate
      );
      if (newCategory) {
        setSelectedCategory(newCategory._id);
        const addedTask = await window.electronAPI.invoke("add-task", {
          categoryId: newCategory._id,
          text,
        });
        if (addedTask) {
          await fetchData();
        }
      }
    } else {
      const addedTask = await window.electronAPI.invoke("add-task", {
        categoryId: selectedCategory,
        text,
      });
      if (addedTask) {
        await fetchData();
      }
    }
  };

  // Uppdatera uppgift via ipc
  const updateTask = async (id, text) => {
    const updatedTask = await window.electronAPI.invoke("update-task", {
      id,
      text,
    });
    if (updatedTask) {
      await fetchData();
    }
  };

  // Toggla uppgiftsstatus via ipc
  const toggleTaskCompletion = async (id) => {
    const toggledTask = await window.electronAPI.invoke(
      "toggle-task-completion",
      id
    );
    if (toggledTask) {
      await fetchData();
    }
  };

  // Radera uppgift via ipc
  const deleteTask = async (id) => {
    const deletedTask = await window.electronAPI.invoke("delete-task", id);
    if (deletedTask) {
      await fetchData();
    }
  };

  const updateTaskOrder = async (_id, order) => {
    await window.electronAPI.invoke("update-tasks-order", _id, order);
  };

  const getTaskCount = (categoryId) => {
    return tasks.filter(
      (task) => task.categoryId === categoryId && !task.completed
    ).length;
  };

  const getFilteredTasks = () => {
    return tasks.filter(
      (task) =>
        task.categoryId === selectedCategory &&
        (searchQuery === "" ||
          task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getCurrentCategory = () => {
    return categories.find((c) => c._id === selectedCategory);
  };

  // Lägg till målning via ipc
  const addPainting = async (name) => {
    const addedpainting = await window.electronAPI.invoke("add-painting", name);
    if (addedpainting) {
      setSelectedPainting(addedpainting);
      await fetchData();
    }
  };

  const updatePainting = async (id, name, strokes) => {
    const updatedPai = await window.electronAPI.invoke("update-painting", {
      id,
      name,
      strokes,
    });
    if (updatedPai) {
      await fetchData();
    }
  };

  return (
    <div className="flex h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-900">
      <Sidebar
        categories={categories}
        paintings={paintings}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPainting={selectedPainting}
        setSelectedPainting={setSelectedPainting}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addCategory={addCategory}
        updateCategory={updateCategory}
        updatePainting={updatePainting}
        deleteCategory={deleteCategory}
        getTaskCount={getTaskCount}
        setPaintMode={setPaintMode}
        addPainting={addPainting}
      />
      {paintMode ? (
        <PaintArea selectedPainting={selectedPainting} setSelectedPainting={setSelectedPainting} updatePainting={updatePainting} />
      ) : (
        <TaskArea
          currentCategory={getCurrentCategory()}
          filteredTasks={getFilteredTasks()}
          addTask={addTask}
          updateTask={updateTask}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          categories={categories}
          updateTaskOrder={updateTaskOrder}
        />
      )}
    </div>
  );
}
