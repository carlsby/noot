import { createPortal } from "react-dom";
import { useEffect } from "react";
import { Eraser } from "lucide-react";

export function ConfirmClearModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-neutral-100 dark:bg-neutral-800 shadow-2xl max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-700">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <Eraser size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Bekräfta rensning</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 font-medium transition-colors border border-neutral-200 dark:border-neutral-600"
            >
              Avbryt
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-yellow-600 text-white hover:bg-yellow-700 font-medium transition-colors shadow-sm"
            >
              Rensa
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
