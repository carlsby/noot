import { useCallback, useEffect, useRef, useState } from "react";
import { Circle, CircleCheck, GripVertical, Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "../shared/ConfirmModal";
import RichTextEditor from "./RichTextEditor";
import { getPlainTextFromRichHtml, isRichHtmlEmpty, openExternalUrl, sanitizeRichHtml } from "../../utils/richText";

export default function TaskItem({ task, updateTask, toggleTaskCompletion, deleteTask, dragHandleProps, editingTaskId, setEditingTaskId, isDragging = false }) {
  const editing = editingTaskId === task._id;
  const [editHtml, setEditHtml] = useState(task.text || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const editContainerRef = useRef(null);
  const latestEditHtml = useRef(task.text || "");
  const savingRef = useRef(false);

  useEffect(() => {
    if (!editing) { latestEditHtml.current = task.text || ""; setEditHtml(task.text || ""); }
  }, [task.text, editing]);

  const save = useCallback(async (html) => {
    if (savingRef.current) return;
    const clean = sanitizeRichHtml(typeof html === "string" ? html : latestEditHtml.current);
    if (isRichHtmlEmpty(clean)) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await updateTask(task._id, clean);
      setEditingTaskId((current) => current === task._id ? null : current);
    } catch {
      setSaveError(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [task._id, updateTask, setEditingTaskId]);

  const cancel = () => {
    latestEditHtml.current = task.text || "";
    setEditHtml(task.text || "");
    setEditingTaskId(null);
  };

  useEffect(() => {
    if (!editing) return;
    const onOutsideClick = (event) => {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target)) save();
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [editing, save]);

  const preview = getPlainTextFromRichHtml(task.text).slice(0, 40);

  return (
    <>
      {editing ? (
        <div ref={editContainerRef} className="note-edit-card">
          <RichTextEditor value={editHtml} onChange={(html) => { latestEditHtml.current = html; setEditHtml(html); }} onSubmit={save} onCancel={cancel}
            placeholder="Redigera anteckning..." autoFocus />
          <div className="note-edit-actions">
            {saveError && <span className="note-save-error" role="alert">Kunde inte spara. Försök igen.</span>}
            <button type="button" onClick={cancel}>Avbryt</button>
            <button type="button" className="primary-action" onClick={() => save()} disabled={saving || isRichHtmlEmpty(editHtml)}>{saving ? "Sparar..." : "Spara"}</button>
          </div>
        </div>
      ) : (
        <div className={`note-card ${task.completed ? "note-completed" : ""} ${isDragging ? "is-dragging" : ""}`}>
          <button type="button" {...dragHandleProps} className="note-drag-handle" title="Dra för att ändra ordning" aria-label="Dra för att ändra ordning"><GripVertical size={17} /></button>
          <div className="note-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(task.text) }}
            onDoubleClick={() => setEditingTaskId(task._id)}
            onClick={(event) => {
              const anchor = event.target.closest?.("a");
              if (anchor) { event.preventDefault(); openExternalUrl(anchor.href); }
            }} />
          <div className="note-actions">
            <button type="button" className="icon-button" title={task.completed ? "Markera som ofärdig" : "Markera som färdig"} aria-label={task.completed ? "Markera som ofärdig" : "Markera som färdig"} onClick={() => toggleTaskCompletion(task._id)}>{task.completed ? <CircleCheck size={18} /> : <Circle size={18} />}</button>
            <button type="button" className="icon-button" title="Redigera anteckning" aria-label="Redigera anteckning" onClick={() => setEditingTaskId(task._id)}><Pencil size={16} /></button>
            <button type="button" className="icon-button" title="Radera anteckning" aria-label="Radera anteckning" onClick={() => setShowConfirm(true)}><Trash2 size={16} /></button>
          </div>
        </div>
      )}
      {showConfirm && <ConfirmModal message={`Ta bort anteckningen ${preview ? `"${preview}${preview.length >= 40 ? "…" : ""}"` : ""}?`}
        onConfirm={() => { deleteTask(task._id); setShowConfirm(false); }} onCancel={() => setShowConfirm(false)} />}
    </>
  );
}
