import { createPortal } from "react-dom"
import { useEffect } from "react"
import { AlertTriangle } from 'lucide-react'

export function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-neutral-100 dark:bg-neutral-900 space:bg-indigo-950 space:border-indigo-900 shadow-2xl max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-700">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 space:bg-red-900 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400 space:text-red-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 space:text-indigo-200">Bekräfta borttagning</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed space:text-gray-400">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 space:bg-indigo-900 space:text-indigo-400 space:border-indigo-900 hover:space:bg-indigo-800 font-medium transition-colors border border-neutral-200 dark:border-neutral-700/70"
            >
              Avbryt
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 font-medium transition-colors shadow-sm"
            >
              Ta bort
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
