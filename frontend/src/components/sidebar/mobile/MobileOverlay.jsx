export default function MobileOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-black/20 z-40"
      onClick={onClose}
    />
  );
}
