import { useState, useEffect } from "react";

import MobileToggle from "./mobile/MobileToggle";
import MobileOverlay from "./mobile/MobileOverlay";
import MobileHeader from "./mobile/MobileHeader";

import SidebarHeader from "./header/SidebarHeader";
import SidebarContent from "./content/SidebarContent";
import SidebarFooter from "./footer/SidebarFooter";
import SidebarSettings from "./settings/SidebarSettings";

import useFolders from "../../hooks/useFolders";

export default function Sidebar({
  categories,
  addCategory,
  selectedCategory,
  setSelectedCategory,
  moveCategoryToFolder,
  addCategoryToFolder,
  updateCategoryOrder,
  updateCategory,
  deleteCategory,
  getAllFonts,
  fontCss,
  setDefaultFont,
  fetchTheme,
  folders,
  updateFolder,
  deleteFolder,
  addFolder,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setSettings(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileMenuOpen]);

  return (
    <>
      <MobileToggle onClick={() => setIsMobileMenuOpen(true)} />
      <MobileOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-full sm:w-80
          transform transition-transform duration-300
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col bg-neutral-100 dark:bg-neutral-950
          border-r overflow-hidden border-neutral-200 dark:border-neutral-700
        `}
      >
        <MobileHeader
          settings={settings}
          setSettings={setSettings}
          close={closeMobileMenu}
        />

        {settings ? (
          <SidebarSettings
            getAllFonts={getAllFonts}
            setDefaultFont={setDefaultFont}
            fontCss={fontCss}
            setSettings={setSettings}
            fetchTheme={fetchTheme}
          />
        ) : (
          <>
            <SidebarHeader setSettings={setSettings} />
            <SidebarContent
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelect={closeMobileMenu}
              folders={folders}
              moveCategoryToFolder={moveCategoryToFolder}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              updateFolder={updateFolder}
              deleteFolder={deleteFolder}
              addCategoryToFolder={addCategoryToFolder}
              updateCategoryOrder={updateCategoryOrder}
              addFolder={addFolder}
            />

            <SidebarFooter addCategory={addCategory} />
          </>
        )}
      </div>
    </>
  );
}
