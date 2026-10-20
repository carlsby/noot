import { useEffect, useRef, useState } from "react";
import { ChevronRight, FilePlus2, Folder, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import CategoryItem from "../category/CategoryItem";
import { ConfirmModal } from "../shared/ConfirmModal";

function InlineName({ icon, value, onChange, onSave, onCancel, onBlurAction = onCancel, label }) {
  const inputRef = useRef(null);
  const finished = useRef(false);
  useEffect(() => {
    const input = inputRef.current;
    input?.focus();
    input?.select();
    input?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);
  return (
    <div className="sidebar-inline-edit">
      {icon}
      <input ref={inputRef} value={value} aria-label={label} placeholder={label} onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") { event.preventDefault(); finished.current = true; onSave(); }
          if (event.key === "Escape") { finished.current = true; onCancel(); }
        }}
        onBlur={() => { if (!finished.current) onBlurAction(); }} />
    </div>
  );
}

export default function FolderItem({ folder, hasChildFolders = false, categories, expanded, toggle,
  selectedCategory, setSelectedCategory, updateCategory, deleteCategory, updateFolder, deleteFolder,
  addCategoryToFolder, addFolder, editingFolderId, setEditingFolderId, onCreatedItem }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);
  const [createType, setCreateType] = useState(null);
  const [newName, setNewName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { if (!editing) setName(folder.name); }, [folder.name, editing]);
  useEffect(() => {
    if (editingFolderId === folder._id) { setEditing(true); setEditingFolderId?.(null); }
  }, [editingFolderId, folder._id, setEditingFolderId]);

  const saveFolderName = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== folder.name) updateFolder(folder._id, trimmed);
    setEditing(false);
  };
  const saveCreated = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const created = createType === "file"
      ? await addCategoryToFolder(trimmed, folder._id)
      : await addFolder(trimmed, folder._id);
    if (created?._id) onCreatedItem?.(createType, created._id);
    setNewName("");
    setCreateType(null);
    if (!expanded) toggle(folder._id);
  };
  const startCreate = (type) => {
    setCreateType(type);
    setNewName("");
    if (!expanded) toggle(folder._id);
  };

  return (
    <>
      <div className="sidebar-folder-block">
        {editing ? (
          <InlineName icon={<Folder size={17} />} value={name} onChange={setName} onSave={saveFolderName} onBlurAction={saveFolderName}
            onCancel={() => { setName(folder.name); setEditing(false); }} label="Mappnamn" />
        ) : (
          <div role="button" tabIndex={0} aria-expanded={expanded} data-item-type="folder" data-item-id={folder._id} className="group sidebar-folder-row"
            onClick={() => toggle(folder._id)}
            onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); toggle(folder._id); } }}>
            <ChevronRight className={`folder-chevron ${expanded ? "is-expanded" : ""}`} size={15} />
            <Folder className="folder-icon" size={17} />
            <span className="sidebar-file-name">{folder.name}</span>
            <span className="sidebar-row-actions">
              <button type="button" title="Ny fil i mappen" aria-label={`Ny fil i ${folder.name}`} onClick={(event) => { event.stopPropagation(); startCreate("file"); }}><FilePlus2 size={14} /></button>
              <button type="button" title="Ny undermapp" aria-label={`Ny undermapp i ${folder.name}`} onClick={(event) => { event.stopPropagation(); startCreate("folder"); }}><FolderPlus size={14} /></button>
              <button type="button" title="Byt namn" aria-label={`Byt namn på ${folder.name}`} onClick={(event) => { event.stopPropagation(); setEditing(true); }}><Pencil size={14} /></button>
              <button type="button" title={hasChildFolders ? "Ta bort undermappar först" : "Radera mapp"} aria-label={`Radera ${folder.name}`}
                disabled={hasChildFolders} onClick={(event) => { event.stopPropagation(); setConfirmDelete(true); }}><Trash2 size={14} /></button>
            </span>
          </div>
        )}

        {createType && <InlineName icon={createType === "file" ? <FilePlus2 size={17} /> : <FolderPlus size={17} />} value={newName} onChange={setNewName}
          onSave={saveCreated} onCancel={() => { setCreateType(null); setNewName(""); }}
          label={createType === "file" ? "Filnamn" : "Mappnamn"} />}

        {expanded && <Droppable droppableId={folder._id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={`folder-dropzone ${snapshot.isDraggingOver ? "is-over" : ""}`}>
              {categories.map((category, index) => <Draggable key={category._id} draggableId={category._id} index={index}>
                {(dragProvided, dragSnapshot) => <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}
                  className={dragSnapshot.isDragging ? "is-dragging" : ""}>
                  <CategoryItem category={category} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                    updateCategory={updateCategory} deleteCategory={deleteCategory} />
                </div>}
              </Draggable>)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>}
      </div>
      {confirmDelete && <ConfirmModal message={`Vill du radera mappen "${folder.name}"? Filerna flyttas till roten.`}
        onConfirm={() => { deleteFolder(folder._id); setConfirmDelete(false); }} onCancel={() => setConfirmDelete(false)} />}
    </>
  );
}
