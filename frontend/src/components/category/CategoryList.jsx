import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FilePlus2, FolderPlus } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import FolderItem from "../folder/FolderItem";
import CategoryItem from "./CategoryItem";

export default function CategoryList({
  folders,
  categories,
  addCategory,
  moveCategoryToFolder,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  updateFolder,
  deleteFolder,
  addFolder,
  updateCategoryOrder,
  addCategoryToFolder,
  rootCreateType,
  setRootCreateType,
}) {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [localCategories, setLocalCategories] = useState([]);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [scrollTarget, setScrollTarget] = useState(null);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const sidebarTreeRef = useRef(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (rootCreateType === "file") {
      setIsCreatingFile(true);
      setIsCreatingFolder(false);
      setRootCreateType?.(null);
    }
    if (rootCreateType === "folder") {
      setIsCreatingFolder(true);
      setIsCreatingFile(false);
      setRootCreateType?.(null);
    }
  }, [rootCreateType, setRootCreateType]);

  useEffect(() => {
    const input = isCreatingFile ? fileInputRef.current : isCreatingFolder ? folderInputRef.current : null;
    if (!input) return;
    input.focus();
    input.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isCreatingFile, isCreatingFolder]);

  useEffect(() => {
    if (!scrollTarget) return;
    const frame = requestAnimationFrame(() => {
      const rows = sidebarTreeRef.current?.querySelectorAll("[data-item-type][data-item-id]") || [];
      const row = Array.from(rows).find((item) => item.dataset.itemType === scrollTarget.type && item.dataset.itemId === scrollTarget.id);
      if (row) {
        row.scrollIntoView({ block: "nearest", behavior: "smooth" });
        setScrollTarget(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollTarget, folders, localCategories, expandedFolders]);

  // auto-expand folder when a category inside it is selected
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;

    const fullCategory = categories.find(
      (cat) =>
        cat._id === selectedCategory ||
        (typeof selectedCategory === "object" &&
          cat._id === selectedCategory._id)
    );

    if (fullCategory?.folderId) {
      const folderById = new Map(folders.map((folder) => [folder._id, folder]));
      const ancestors = [];
      let folderId = fullCategory.folderId;
      while (folderId && !ancestors.includes(String(folderId))) {
        ancestors.push(String(folderId));
        folderId = folderById.get(folderId)?.parentId;
      }
      setExpandedFolders((prev) => [...new Set([...prev, ...ancestors])]);
    }
  }, [selectedCategory, categories, folders]);

  const toggleFolder = useCallback((id) => {
    const idStr = String(id);
    setExpandedFolders((prev) =>
      prev.includes(idStr)
        ? prev.filter((fId) => fId !== idStr)
        : [...prev, idStr]
    );
  }, []);

  const onCreatedItem = useCallback((type, id) => setScrollTarget({ type, id }), []);

  // get sorted categories for folder, if null its root
  const categoriesInFolder = useCallback(
    (folderId) =>
      localCategories
        .filter((c) => c.folderId === folderId)
        .sort((a, b) => a.order - b.order),
    [localCategories]
  );

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceFolderId =
      source.droppableId === "root" ? null : source.droppableId;
    const destFolderId =
      destination.droppableId === "root" ? null : destination.droppableId;

    if (sourceFolderId === destFolderId && source.index === destination.index)
      return;

    const newCategories = localCategories.map((category) => ({ ...category }));
    const dragged = newCategories.find((c) => c._id === draggableId);
    if (!dragged) return;

    dragged.folderId = destFolderId;

    // remove from old pos
    const filtered = newCategories.filter((c) => c._id !== draggableId);

    // Get destination list and insert it
    const destCategories = filtered
      .filter((c) => c.folderId === destFolderId)
      .sort((a, b) => a.order - b.order);

    destCategories.splice(destination.index, 0, dragged);

    // reassign order
    destCategories.forEach((cat, idx) => {
      cat.order = idx;
    });

    // merge back
    const updatedCategories = [
      ...filtered.filter((c) => c.folderId !== destFolderId),
      ...destCategories,
    ];

    setLocalCategories(updatedCategories);

    // update backend
    await moveCategoryToFolder(draggableId, destFolderId);
    await updateCategoryOrder(
      destCategories.map((c) => ({ _id: c._id, order: c.order }))
    );
  };

  const handleSaveNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const created = await addFolder(name, null);
    if (created?._id) onCreatedItem("folder", created._id);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const handleSaveNewFile = async () => {
    const name = newFileName.trim();
    if (!name) return;
    const created = await addCategory(name);
    if (created?._id) onCreatedItem("file", created._id);
    setNewFileName("");
    setIsCreatingFile(false);
  };

  const handleCancelNewFolder = () => {
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const rootCategories = categoriesInFolder(null);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div ref={sidebarTreeRef} className="sidebar-tree">
        <FolderTree
          folders={folders}
          categoriesInFolder={categoriesInFolder}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          getTaskCount={getTaskCount}
          updateFolder={updateFolder}
          deleteFolder={deleteFolder}
          addCategoryToFolder={addCategoryToFolder}
          addFolder={addFolder}
          editingFolderId={editingFolderId}
          setEditingFolderId={setEditingFolderId}
          onCreatedItem={onCreatedItem}
        />

        <Droppable droppableId="root">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`root-dropzone ${snapshot.isDraggingOver ? "is-over" : ""}`}
            >
              {rootCategories.map((cat, index) => (
                <Draggable key={cat._id} draggableId={cat._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "is-dragging" : ""}
                    >
                      <CategoryItem
                        category={cat}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        updateCategory={updateCategory}
                        deleteCategory={deleteCategory}
                        getTaskCount={getTaskCount}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {isCreatingFile && (
          <div className="sidebar-inline-edit">
            <FilePlus2 size={17} />
            <input
              ref={fileInputRef}
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveNewFile();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setNewFileName("");
                  setIsCreatingFile(false);
                }
              }}
              onBlur={() => {
                setNewFileName("");
                setIsCreatingFile(false);
              }}
              className="sidebar-name-input"
              autoFocus
              placeholder="Filnamn"
            />
          </div>
        )}

        {isCreatingFolder && (
          <div className="sidebar-inline-edit">
            <FolderPlus size={17} />
            <input
              ref={folderInputRef}
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveNewFolder();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancelNewFolder();
                }
              }}
              onBlur={handleCancelNewFolder}
              className="sidebar-name-input"
              autoFocus
              placeholder="Mappnamn"
            />
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

function FolderTree({
  folders,
  categoriesInFolder,
  expandedFolders,
  toggleFolder,
  selectedCategory,
  setSelectedCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  updateFolder,
  deleteFolder,
  addCategoryToFolder,
  addFolder,
  editingFolderId,
  setEditingFolderId,
  onCreatedItem,
  parentId = null,
  depth = 0,
}) {
  const childFolders = folders
    .filter((folder) => {
      const actualParent = folder.parentId ?? null;
      return parentId === null
        ? actualParent === null || !folders.some((candidate) => candidate._id === actualParent)
        : actualParent === parentId;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (childFolders.length === 0) return null;

  return (
    <div className={depth > 0 ? "nested-folders" : ""}>
      {childFolders.map((folder) => (
        <div key={folder._id}>
          <FolderItem
            folder={folder}
            hasChildFolders={folders.some((candidate) => candidate.parentId === folder._id)}
            categories={categoriesInFolder(folder._id)}
            expanded={expandedFolders.includes(String(folder._id))}
            toggle={toggleFolder}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            getTaskCount={getTaskCount}
            updateFolder={updateFolder}
            deleteFolder={deleteFolder}
            addCategoryToFolder={addCategoryToFolder}
            addFolder={addFolder}
            editingFolderId={editingFolderId}
            setEditingFolderId={setEditingFolderId}
            onCreatedItem={onCreatedItem}
          />
          {expandedFolders.includes(String(folder._id)) && (
            <FolderTree
              folders={folders}
              categoriesInFolder={categoriesInFolder}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              getTaskCount={getTaskCount}
              updateFolder={updateFolder}
              deleteFolder={deleteFolder}
              addCategoryToFolder={addCategoryToFolder}
              addFolder={addFolder}
              editingFolderId={editingFolderId}
              setEditingFolderId={setEditingFolderId}
              onCreatedItem={onCreatedItem}
              parentId={folder._id}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}
