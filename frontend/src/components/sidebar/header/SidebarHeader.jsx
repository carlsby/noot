import { FilePlus2, FolderPlus, PanelLeftClose, Settings, X } from "lucide-react";
import NootLogo from "../../../assets/noot.png";

export default function SidebarHeader({ setSettings, onCreateFile, onCreateFolder, onToggle, onMobileClose }) {
  return (
    <header className="sidebar-header">
      <div className="sidebar-brand-row">
        <div className="sidebar-brand"><img src={NootLogo} alt="" /><span>Noot</span></div>
        <div className="sidebar-header-actions">
          <button type="button" className="icon-button desktop-only" title="Dölj sidomenyn (Ctrl+Shift+B)" aria-label="Dölj sidomenyn" onClick={onToggle}><PanelLeftClose size={19} /></button>
          <button type="button" className="icon-button mobile-only" title="Stäng sidomenyn" aria-label="Stäng sidomenyn" onClick={onMobileClose}><X size={19} /></button>
        </div>
      </div>
      <div className="sidebar-primary-actions">
        <button type="button" className="new-file-button" onClick={onCreateFile}><FilePlus2 size={17} /> Ny fil</button>
        <button type="button" className="icon-button" title="Ny mapp" aria-label="Ny mapp" onClick={onCreateFolder}><FolderPlus size={18} /></button>
        <button type="button" className="icon-button" title="Inställningar" aria-label="Inställningar" onClick={() => setSettings(true)}><Settings size={18} /></button>
      </div>
    </header>
  );
}
