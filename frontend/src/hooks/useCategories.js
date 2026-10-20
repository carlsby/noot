import { useState, useEffect } from "react";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fetchCategories = async () => {
    const cats = await window.electronAPI.invoke("get-categories");
    setCategories(cats);
    return cats;
  };

  const loadSelectedCategory = async () => {
    const savedCategoryId = await window.electronAPI.invoke(
      "get-selected-category"
    );
    if (!savedCategoryId) { setLoaded(true); return; }
    const cats = await window.electronAPI.invoke("get-categories");
    const exists = cats.some((cat) => cat._id === savedCategoryId);
    if (exists) setSelectedCategory(savedCategoryId);
    else {
      await window.electronAPI.invoke("clear-selected-category");
      setSelectedCategory(null);
    }
    setLoaded(true);
  };

  useEffect(() => {
    fetchCategories();
    loadSelectedCategory();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.electronAPI.invoke(selectedCategory ? "set-selected-category" : "clear-selected-category", selectedCategory);
  }, [selectedCategory, loaded]);

  const addCategory = async (name) => {
    const addedCategory = await window.electronAPI.invoke("add-category", name);
    if (addedCategory) {
      setSelectedCategory(addedCategory._id);
      await fetchCategories();
      return addedCategory;
    }
  };

  const addCategoryToFolder = async (name, folderId) => {
    const createdCategory = await window.electronAPI.invoke("add-category-to-folder", {
      name,
      folderId,
    });
    await fetchCategories();
    setSelectedCategory(createdCategory._id);
    return createdCategory;
  };

  const updateCategory = async (id, name) => {
    await window.electronAPI.invoke("update-category", { id, name });
    await fetchCategories();
  };

  const deleteCategory = async (id) => {
    await window.electronAPI.invoke("delete-category", id);
    await fetchCategories();
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };

  const moveCategoryToFolder = async (categoryId, folderId, order) => {
    await window.electronAPI.invoke("move-category-to-folder", {
      categoryId,
      folderId,
      order,
    });
    await fetchCategories();
  };

  // Save the order of files within one folder.
  const updateCategoryOrder = async (orderedCategories) => {
    await window.electronAPI.invoke("update-categories-order", orderedCategories);
    await fetchCategories();
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
