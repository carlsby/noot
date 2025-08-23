import { Settings, X } from "lucide-react";
import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import FontSelector from "./FontSelector";

export default function SettingsMenu({
  setSettings,
  getAllFonts,
  setDefaultFont,
  fontCss,
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="hidden lg:flex h-[80px] items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Settings className="text-gray-500" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-neutral-900 dark:text-neutral-100">
              Inställningar
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Anpassa Noot
            </p>
          </div>
          <X
            className="text-gray-500 hover:text-black dark:hover:text-gray-400 cursor-pointer"
            onClick={() => setSettings(false)}
          />
        </div>
      </div>

      <div className="h-full">
        <ul>
          <li className="group border-b dark:border-gray-700 space:border-green-950 text-sm">
            <div className="group relative transition-all duration-300 ease-out hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <div className="w-full flex items-center gap-3 text-left relative">
                <DarkModeToggle />
              </div>
            </div>
          </li>
          <li className="group border-b dark:border-gray-700 space:border-green-950 text-sm">
            <div className="group relative transition-all duration-300 ease-out hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <div className="w-full flex items-center gap-3 text-left relative">
                <FontSelector
                  getAllFonts={getAllFonts}
                  setDefaultFont={setDefaultFont}
                  currentFont={fontCss}
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
