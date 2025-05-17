import { useState } from "react";

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Avbryt
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>
  );
}
