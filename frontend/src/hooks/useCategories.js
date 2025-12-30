import { useState, useEffect } from "react";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    const cats = await window.electronAPI.invoke("get-categories");
    setCategories(cats);
  };

  const loadSelectedCategory = async () => {
    const savedCategoryId = await window.electronAPI.invoke(
      "get-selected-category"
    );
    if (!savedCategoryId) return;
    const cats = await window.electronAPI.invoke("get-categories");
    const exists = cats.some((cat) => cat._id === savedCategoryId);
    if (exists) setSelectedCategory(savedCategoryId);
    else {
      await window.electronAPI.invoke("clear-selected-category");
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    fetchCategories();
    loadSelectedCategory();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      window.electronAPI.invoke("set-selected-category", selectedCategory);
    }
  }, [selectedCategory]);

  const addCategory = async (name) => {
    const addedCategory = await window.electronAPI.invoke("add-category", name);
    if (addedCategory) {
      setSelectedCategory(addedCategory._id);
      fetchCategories();
      return addedCategory;
    }
  };

  const addCategoryToFolder = async (name, folderId) => {
    await window.electronAPI.invoke("add-category-to-folder", {
      name,
      folderId,
    });
    fetchCategories();
  };

  const updateCategory = async (id, name) => {
    await window.electronAPI.invoke("update-category", { id, name });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await window.electronAPI.invoke("delete-category", id);
    fetchCategories();
    if (selectedCategory === id) {
      setSelectedCategory(categories[0]?._id || null);
    }
  };

  const moveCategoryToFolder = async (categoryId, folderId, order) => {
    await window.electronAPI.invoke("move-category-to-folder", {
      categoryId,
      folderId,
      order,
    });
    fetchCategories();
  };

  // updates task order
  const updateCategoryOrder = async (_id, order) => {
    await window.electronAPI.invoke("update-categories-order", _id, order);
  };

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    moveCategoryToFolder,
    updateCategoryOrder,
    addCategoryToFolder,
  };
}
