import { useState, useEffect } from "react";
import { Menu, X, Home } from "lucide-react";
import CategoryList from "./CategoryList";
import AddCategoryForm from "./AddCategoryForm";
import DarkModeToggle from "./DarkModeToggle";
import NootLogo from "../assets/noot.png";

export default function Sidebar({
  darkMode,
  toggleDarkMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getTaskCount,
  setCodeMode,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
        className="lg:hidden fixed top-3 left-4 z-50"
        aria-label="Open menu"
      >
        <Menu size={24} className="text-gray-700 dark:text-gray-300" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-full sm:w-80 lg:w-72 
          transform transition-all duration-300 ease-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col border-r
          dark:bg-gray-900/95 dark:border-gray-700 
          bg-gray-50/95 border-gray-200
          backdrop-blur-xl lg:backdrop-blur-none
          shadow-2xl lg:shadow-none
          overflow-hidden
        `}
      >
        <div className="lg:hidden flex items-center justify-between p-4 border-b mb-2 dark:border-gray-700 border-gray-200 bg-white/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <img src={NootLogo} className="text-white w-8" />
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Noot
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Från skaparen av Bebtlix
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="hidden lg:flex items-center justify-between p-4 border-b mb-2 dark:border-gray-700 border-gray-200 bg-white/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3 w-full">
              <img src={NootLogo} className="text-white w-8" />
              <div className="w-full">
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                      Noot
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Från skaparen av Bebtlix
                    </p>
                  </div>
                  <DarkModeToggle
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Kategorier
            </h2>
          </div>

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
            setCodeMode={setCodeMode}
          />

          <div className="mt-auto space-y-4 p-4">
            <AddCategoryForm addCategory={addCategory} />
          </div>
        </div>
      </div>
    </>
  );
}
