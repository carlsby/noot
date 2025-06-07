import { createPortal } from "react-dom";
import { useEffect } from "react";

export function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
        <p className="text-gray-900 dark:text-white mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
