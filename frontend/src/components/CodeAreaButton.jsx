import React from "react";

export default function CodeAreaButton({ setCodeMode, setSelectedCategory }) {
  return (
    <button
      class="relative inline-flex items-center justify-center p-0.5 mt-4 me-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-0 focus:outline-none"
      onClick={() => {
        setCodeMode(true);
        setSelectedCategory(false);
      }}
    >
      <span class="relative px-5 py-2.5 transition-all w-full ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
        Kod
      </span>
    </button>
  );
}
