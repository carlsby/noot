import SettingsMenu from "./SettingsMenu";

export default function SidebarSettings({
  setSettings,
  getAllFonts,
  setDefaultFont,
  fontCss,
  theme,
  changeTheme,
  noteFontSize,
  changeNoteFontSize,
  fontSizeSaving,
  fontSizeError,
}) {
  return (
    <SettingsMenu
      setSettings={setSettings}
      getAllFonts={getAllFonts}
      setDefaultFont={setDefaultFont}
      fontCss={fontCss}
      theme={theme}
      changeTheme={changeTheme}
      noteFontSize={noteFontSize}
      changeNoteFontSize={changeNoteFontSize}
      fontSizeSaving={fontSizeSaving}
      fontSizeError={fontSizeError}
    />
  );
}
