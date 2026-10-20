import { useEffect } from "react";
import { createPortal } from "react-dom";

export function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return createPortal(
    <div className="confirm-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <h3 id="confirm-title">Bekräfta borttagning</h3>
        <p id="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" onClick={onCancel}>Avbryt</button>
          <button type="button" className="danger-action" onClick={onConfirm}>Ta bort</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
