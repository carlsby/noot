import { useState, useEffect } from "react";
import { Menu, Settings, X } from "lucide-react";
import CategoryList from "./category/CategoryList";
import AddCategoryForm from "./category/AddCategoryForm";
import NootLogo from "../../assets/noot.png";
import TabNavigation from "./TabNavigation";
import PaintList from "./paint/PaintList";
import AddPaintForm from "./paint/AddPaintForm";
import SettingsMenu from "./settings/SettingsMenu";

export default function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  setPaintMode,
  addPainting,
  paintings,
  selectedPainting,
  setSelectedPainting,
  updatePainting,
  deletePainting,
  getAllFonts,
  setDefaultFont,
  fontCss,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("note");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setSettings(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-7 left-4 z-50"
        aria-label="Öppna meny"
      >
        <Menu size={24} className="text-gray-700 dark:text-gray-300" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-full sm:w-80 lg:w-80 
          transform transition-transform duration-300 ease-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col
          bg-neutral-100 dark:bg-neutral-950
          border-r border-neutral-200 dark:border-neutral-700
          shadow-xl lg:shadow-none
          overflow-hidden
        `}
      >
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          {settings ? (
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
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img
                    src={NootLogo || "/placeholder.svg"}
                    className="w-25 h-25"
                    alt="Noot Logo"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-neutral-900 dark:text-neutral-100">
                    Noot
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Från skaparen av Bebtlix
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings(true)}
                  className=" text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                >
                  <Settings size={24} />
                </button>

                <button
                  onClick={closeMobileMenu}
                  className=" text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
            </>
          )}
        </div>

        {settings ? (
          <SettingsMenu
            setSettings={setSettings}
            getAllFonts={getAllFonts}
            setDefaultFont={setDefaultFont}
            fontCss={fontCss}
          />
        ) : (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="hidden lg:flex h-[80px] items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <img
                      src={NootLogo || "/placeholder.svg"}
                      className="w-25 h-25"
                      alt="Noot Logo"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="font-bold text-neutral-900 dark:text-neutral-100">
                      Noot
                    </h1>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Från skaparen av Bebtlix
                    </p>
                  </div>
                  <Settings
                    className="text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                    onClick={() => setSettings(true)}
                  />
                </div>
              </div>

              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setPaintMode={setPaintMode}
                setSelectedPainting={setSelectedPainting}
                paintings={paintings}
              />

              <div className="flex-1 overflow-y-auto ">
                {activeTab === "note" ? (
                  <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(categoryId) => {
                      setSelectedCategory(categoryId);
                      closeMobileMenu();
                    }}
                    updateCategory={updateCategory}
                    deleteCategory={deleteCategory}
                    getTaskCount={getTaskCount}
                  />
                ) : (
                  <PaintList
                    paintings={paintings}
                    setSelectedPainting={(painting) => {
                      setSelectedPainting(painting);
                      closeMobileMenu();
                    }}
                    selectedPainting={selectedPainting}
                    updatePainting={updatePainting}
                    deletePainting={deletePainting}
                  />
                )}
              </div>

              <div className="mt-auto flex items-center justify-center border-t px-8 border-neutral-200 dark:border-neutral-700 h-[95px]">
                {activeTab === "note" ? (
                  <AddCategoryForm addCategory={addCategory} />
                ) : (
                  <AddPaintForm addPainting={addPainting} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
