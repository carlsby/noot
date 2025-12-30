import { Settings } from "lucide-react";
import NootLogo from "../../../assets/noot.png";

export default function SidebarHeader({ setSettings }) {
  return (
    <div className="hidden lg:flex h-[80px] items-center p-6 border-b border-neutral-200 dark:border-neutral-700">
      <img src={NootLogo} className="w-10 h-10" />
      <h1 className="ml-3 font-bold flex-1">Noot</h1>
      <Settings
        className="cursor-pointer"
        onClick={() => setSettings(true)}
      />
    </div>
  );
}
