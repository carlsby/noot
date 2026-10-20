import { Search, X } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="sidebar-search">
      <Search size={17} aria-hidden="true" />
      <input type="search" aria-label="Sök filer och anteckningar" placeholder="Sök filer och anteckningar"
        value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
      {searchQuery && <button type="button" className="icon-button" title="Rensa sökning" aria-label="Rensa sökning" onClick={() => setSearchQuery("")}><X size={16} /></button>}
    </div>
  );
}
