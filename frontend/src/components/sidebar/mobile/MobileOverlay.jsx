export default function MobileOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="sidebar-overlay"
      onClick={onClose}
    />
  );
}
