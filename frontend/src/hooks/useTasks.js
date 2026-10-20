import { useCallback, useEffect, useRef, useState } from "react";

export default function useTasks(selectedCategory) {
  const [taskState, setTaskState] = useState({ categoryId: null, items: [] });
  const requestId = useRef(0);
  const categoryRef = useRef(selectedCategory);
  categoryRef.current = selectedCategory;

  const fetchTasks = useCallback(async (categoryId) => {
    const request = ++requestId.current;
    if (!categoryId) {
      setTaskState({ categoryId: null, items: [] });
      return;
    }
    const allTasks = await window.electronAPI.invoke("get-tasks");
    if (request === requestId.current && categoryRef.current === categoryId) {
      setTaskState({ categoryId, items: allTasks.filter((task) => task.categoryId === categoryId) });
    }
  }, []);

  useEffect(() => {
    fetchTasks(selectedCategory);
  }, [selectedCategory, fetchTasks]);

  const addTask = async (text) => {
    if (!text.trim() || !selectedCategory) return;
    await window.electronAPI.invoke("add-task", { categoryId: selectedCategory, text });
    await fetchTasks(selectedCategory);
  };

  const updateTask = async (id, text) => {
    await window.electronAPI.invoke("update-task", { id, text });
    await fetchTasks(selectedCategory);
  };

  const toggleTaskCompletion = async (id) => {
    await window.electronAPI.invoke("toggle-task-completion", id);
    await fetchTasks(selectedCategory);
  };

  const deleteTask = async (id) => {
    await window.electronAPI.invoke("delete-task", id);
    await fetchTasks(selectedCategory);
  };

  return { tasks: taskState.categoryId === selectedCategory ? taskState.items : [], addTask, updateTask, toggleTaskCompletion, deleteTask, fetchTasks };
}
