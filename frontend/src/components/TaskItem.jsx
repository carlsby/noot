import { useEffect, useRef, useState } from "react"
import { CheckCircle, Circle, Edit, Trash, Save, X, GripVertical } from 'lucide-react'
import { ConfirmModal } from "./ConfirmModal"

export default function TaskItem({
  task,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  dragHandleProps,
  editingTaskId,
  setEditingTaskId,
  isDragging = false,
}) {
  const isEditing = editingTaskId === task._id
  const [editText, setEditText] = useState(task.text)
  const [showConfirm, setShowConfirm] = useState(false)

  const editContainerRef = useRef(null)

  const handleSave = () => {
    if (editText.trim() === "") return
    updateTask(task._id, editText)
    setEditingTaskId(null)
  }

  const handleCancel = () => {
    setEditText(task.text)
    setEditingTaskId(null)
  }

  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (event) => {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target)) {
        handleSave()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing, editText])

  if (isEditing) {
    return (
      <div
        ref={editContainerRef}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleTaskCompletion(task._id)
              setEditingTaskId(null)
            }}
            className="flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
            title={task.completed ? "Undo complete" : "Mark complete"}
          >
            {task.completed ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} />}
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            autoFocus
            placeholder="Skriv din anteckning..."
          />

          <div className="flex items-center gap-1">
            <button
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              onClick={handleSave}
            >
              <Save size={16} />
            </button>
            <button
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              onClick={handleCancel}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        {...dragHandleProps}
        className={`group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-grab active:cursor-grabbing ${
          task.completed ? "opacity-60" : ""
        } ${isDragging ? "shadow-lg border-purple-300 dark:border-purple-600" : "hover:shadow-sm"}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity">
            <GripVertical size={16} className="text-slate-400" />
          </div>

          <button
            onClick={() => toggleTaskCompletion(task._id)}
            className="flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
            title={task.completed ? "Undo complete" : "Mark complete"}
          >
            {task.completed ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} />}
          </button>

          <span
            onDoubleClick={() => setEditingTaskId(task._id)}
            title="Dubbelklicka för att redigera"
            className={`flex-1 cursor-pointer text-sm transition-colors ${
              task.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {task.text}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              onClick={() => setShowConfirm(true)}
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          message={`Är du säker på att du vill ta bort anteckningen "${task.text}"?`}
          onConfirm={() => {
            deleteTask(task._id)
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
