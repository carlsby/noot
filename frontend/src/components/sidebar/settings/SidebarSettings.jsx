import SettingsMenu from "./SettingsMenu";

export default function SidebarSettings({
  setSettings,
  getAllFonts,
  setDefaultFont,
  fontCss,
  fetchTheme,
}) {
  return (
    <SettingsMenu
      setSettings={setSettings}
      getAllFonts={getAllFonts}
      setDefaultFont={setDefaultFont}
      fontCss={fontCss}
      fetchTheme={fetchTheme}
    />
  );
}
