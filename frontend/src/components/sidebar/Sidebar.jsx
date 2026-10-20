import { useState, useEffect } from "react";

import MobileOverlay from "./mobile/MobileOverlay";

import SidebarHeader from "./header/SidebarHeader";
import SidebarContent from "./content/SidebarContent";
import SidebarSettings from "./settings/SidebarSettings";

export default function Sidebar({
  isOpen,
  isMobileOpen,
  onMobileClose,
  onToggle,
  width,
  onWidthChange,
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
  theme,
  changeTheme,
  noteFontSize,
  changeNoteFontSize,
  fontSizeSaving,
  fontSizeError,
  folders,
  updateFolder,
  deleteFolder,
  addFolder,
}) {
  const [settings, setSettings] = useState(false);
  const [rootCreateType, setRootCreateType] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const closeMobileMenu = () => {
    onMobileClose();
    setSettings(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        onMobileClose();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onMobileClose]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (event) => onWidthChange(Math.max(280, Math.min(520, Math.min(window.innerWidth * 0.45, event.clientX))));
    const onUp = () => setIsResizing(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, onWidthChange]);

  return (
    <>
      <MobileOverlay isOpen={isMobileOpen} onClose={closeMobileMenu} />

      <div
        className={`app-sidebar ${isMobileOpen ? "mobile-open" : ""} ${isOpen ? "" : "desktop-closed"}`}
        style={{ "--sidebar-width": `${width}px` }}
      >
        {settings ? (
          <SidebarSettings
            getAllFonts={getAllFonts}
            setDefaultFont={setDefaultFont}
            fontCss={fontCss}
            setSettings={setSettings}
            theme={theme}
            changeTheme={changeTheme}
            noteFontSize={noteFontSize}
            changeNoteFontSize={changeNoteFontSize}
            fontSizeSaving={fontSizeSaving}
            fontSizeError={fontSizeError}
          />
        ) : (
          <>
            <SidebarHeader
              setSettings={setSettings}
              onToggle={onToggle}
              onMobileClose={closeMobileMenu}
              onCreateFile={() => setRootCreateType("file")}
              onCreateFolder={() => setRootCreateType("folder")}
            />
            <SidebarContent
              categories={categories}
              addCategory={addCategory}
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
              rootCreateType={rootCreateType}
              setRootCreateType={setRootCreateType}
            />
          </>
        )}
        <div className="sidebar-resize" role="separator" aria-label="Ändra sidomenyns bredd" aria-orientation="vertical" tabIndex={0}
          onPointerDown={(event) => { event.preventDefault(); setIsResizing(true); }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") onWidthChange(Math.max(280, width - 20));
            if (event.key === "ArrowRight") onWidthChange(Math.min(520, width + 20));
          }} />
      </div>
    </>
  );
}
