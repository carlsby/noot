import { useEffect, useState } from "react";

export default function FontSelector({ getAllFonts, setDefaultFont, currentFont }) {
  const [fonts, setFonts] = useState([]);
  useEffect(() => {
    let active = true;
    getAllFonts().then((items) => { if (active) setFonts(items); });
    return () => { active = false; };
  }, [getAllFonts]);

  const selectedId = fonts.find((font) => font.css === currentFont)?._id || "";
  return (
    <div className="setting-field">
      <label htmlFor="font-select">Typsnitt</label>
      <select id="font-select" value={selectedId} onChange={(event) => setDefaultFont(event.target.value)}>
        {!selectedId && <option value="">Välj typsnitt</option>}
        {fonts.map((font) => <option key={font._id} value={font._id}>{font.name}</option>)}
      </select>
    </div>
  );
}
