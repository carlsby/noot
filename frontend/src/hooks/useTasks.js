import { useState, useEffect } from "react";

export default function useTasks(selectedCategory) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (categoryId) => {
    if (!categoryId) return setTasks([]);
    const tks = await window.electronAPI.invoke("get-tasks"); 
    setTasks(tks.filter(t => t.categoryId === categoryId));
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchTasks(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchTasks(selectedCategory);
    }
  }, []);

  const addTask = async (text) => {
    if (!text.trim() || !selectedCategory) return;
    await window.electronAPI.invoke("add-task", { categoryId: selectedCategory, text });
    fetchTasks(selectedCategory);
  };

  const updateTask = async (id, text) => {
    await window.electronAPI.invoke("update-task", { id, text });
    fetchTasks(selectedCategory);
  };

  const toggleTaskCompletion = async (id) => {
    await window.electronAPI.invoke("toggle-task-completion", id);
    fetchTasks(selectedCategory);
  };

  const deleteTask = async (id) => {
    await window.electronAPI.invoke("delete-task", id);
    fetchTasks(selectedCategory);
  };

  return { tasks, addTask, updateTask, toggleTaskCompletion, deleteTask, fetchTasks };
}
