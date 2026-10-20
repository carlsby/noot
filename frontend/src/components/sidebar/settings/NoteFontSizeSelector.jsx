const SIZES = Array.from({ length: 9 }, (_, index) => index + 12);

export default function NoteFontSizeSelector({ value, onChange, saving, error }) {
  return (
    <div className="setting-field">
      <label htmlFor="note-font-size">Textstorlek i anteckningar</label>
      <select id="note-font-size" value={value} disabled={saving} onChange={(event) => onChange(Number(event.target.value))}>
        {SIZES.map((size) => <option key={size} value={size}>{size} px</option>)}
      </select>
      <span className="setting-hint">Gäller alla filer och sparas automatiskt.</span>
      {error && <span className="setting-error" role="alert">{error}</span>}
    </div>
  );
}
