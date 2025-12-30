import { Settings, X } from "lucide-react";
import NootLogo from "../../../assets/noot.png";

export default function MobileHeader({ settings, setSettings, close }) {
  return (
    <div className="lg:hidden p-6 border-b flex items-center justify-between">
      {settings ? (
        <>
          <h1 className="font-bold">Inställningar</h1>
          <X onClick={() => setSettings(false)} className="cursor-pointer" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <img src={NootLogo} className="w-10 h-10" />
            <h1 className="font-bold">Noot</h1>
          </div>
          <div className="flex gap-2">
            <Settings onClick={() => setSettings(true)} />
            <X onClick={close} />
          </div>
        </>
      )}
    </div>
  );
}
