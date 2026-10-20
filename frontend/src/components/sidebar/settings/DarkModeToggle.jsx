import { THEMES } from "../../../hooks/useTheme";

export default function DarkModeToggle({ theme, changeTheme }) {
  return (
    <div className="setting-field">
      <label htmlFor="theme-select">Tema</label>
      <select id="theme-select" value={theme} onChange={(event) => changeTheme(event.target.value)}>
        {THEMES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </div>
  );
}
