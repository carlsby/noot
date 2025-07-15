import { Search } from "lucide-react"

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 
                  bg-gray-200 text-gray-900 placeholder-gray-500
                  transition-colors"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 w-4 h-4" />
    </div>
  )
}
