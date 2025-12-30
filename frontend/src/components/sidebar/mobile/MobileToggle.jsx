import { Menu } from "lucide-react";

export default function MobileToggle({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-7 left-4 z-50"
    >
      <Menu size={24} />
    </button>
  );
}
