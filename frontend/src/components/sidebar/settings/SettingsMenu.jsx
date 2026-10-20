import { ArrowLeft } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import FontSelector from "./FontSelector";
import NoteFontSizeSelector from "./NoteFontSizeSelector";

export default function SettingsMenu({ setSettings, getAllFonts, setDefaultFont, fontCss, theme, changeTheme,
  noteFontSize, changeNoteFontSize, fontSizeSaving, fontSizeError }) {
  return (
    <div className="sidebar-settings">
      <header className="sidebar-settings-header">
        <button type="button" className="icon-button" title="Tillbaka till filer" aria-label="Tillbaka till filer" onClick={() => setSettings(false)}><ArrowLeft size={19} /></button>
        <h1>Inställningar</h1>
      </header>
      <div className="sidebar-settings-body">
        <p className="settings-section-label">Utseende</p>
        <DarkModeToggle theme={theme} changeTheme={changeTheme} />
        <FontSelector getAllFonts={getAllFonts} setDefaultFont={setDefaultFont} currentFont={fontCss} />
        <NoteFontSizeSelector value={noteFontSize} onChange={changeNoteFontSize} saving={fontSizeSaving} error={fontSizeError} />
      </div>
    </div>
  );
}
