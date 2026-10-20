import { useState, useEffect } from "react";

export default function useFolders() {
  const [folders, setFolders] = useState([]);

  const fetchFolders = async () => {
    const data = await window.electronAPI.invoke("get-folders");
    setFolders(data);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const addFolder = async (name, parentId = null) => {
    const created = await window.electronAPI.invoke("add-folder", { name, parentId });
    await fetchFolders();
    return created;
  };

  const updateFolder = async (id, name) => {
    await window.electronAPI.invoke("update-folder", { id, name });
    await fetchFolders();
  };

  const deleteFolder = async (id) => {
    await window.electronAPI.invoke("delete-folder", id);
    await fetchFolders();
  };

  return { folders, addFolder, updateFolder, deleteFolder, fetchFolders };
}
