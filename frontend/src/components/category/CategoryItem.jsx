import { useEffect, useRef, useState } from "react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "../shared/ConfirmModal";

export default function CategoryItem({ category, selectedCategory, setSelectedCategory, updateCategory, deleteCategory }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef(null);
  const editingFinished = useRef(false);

  useEffect(() => { if (!editing) setName(category.name); }, [category.name, editing]);
  useEffect(() => { if (editing) { editingFinished.current = false; inputRef.current?.focus(); inputRef.current?.select(); } }, [editing]);

  const save = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== category.name) updateCategory(category._id, trimmed);
    else setName(category.name);
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <div className="sidebar-inline-edit">
          <FileText size={17} style={{ color: category.color || "var(--accent)" }} />
          <input ref={inputRef} value={name} aria-label="Filnamn" onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") { editingFinished.current = true; save(); }
              if (event.key === "Escape") { editingFinished.current = true; setName(category.name); setEditing(false); }
            }} onBlur={() => { if (!editingFinished.current) save(); }} />
        </div>
      ) : (
        <div role="button" tabIndex={0} aria-current={selectedCategory === category._id ? "page" : undefined}
          data-item-type="file" data-item-id={category._id}
          className={`group sidebar-file-row ${selectedCategory === category._id ? "is-active" : ""}`}
          onClick={() => setSelectedCategory(category._id)}
          onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedCategory(category._id); } }}>
          <FileText className="sidebar-file-icon" size={17} style={{ color: category.color || "var(--accent)" }} />
          <span className="sidebar-file-name" title={category.name}>{category.name}</span>
          <span className="sidebar-row-actions">
            <button type="button" className="icon-button" title="Byt namn" aria-label={`Byt namn på ${category.name}`} onClick={(event) => { event.stopPropagation(); setEditing(true); }}><Pencil size={14} /></button>
            <button type="button" className="icon-button" title="Radera fil" aria-label={`Radera ${category.name}`} onClick={(event) => { event.stopPropagation(); setConfirmDelete(true); }}><Trash2 size={14} /></button>
          </span>
        </div>
      )}
      {confirmDelete && <ConfirmModal message={`Vill du radera filen "${category.name}" och dess anteckningar?`}
        onConfirm={() => { deleteCategory(category._id); setConfirmDelete(false); }} onCancel={() => setConfirmDelete(false)} />}
    </>
  );
}
