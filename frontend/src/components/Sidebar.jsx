"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
          bg-white dark:bg-slate-900 
          border-r border-slate-200 dark:border-slate-700
          shadow-xl lg:shadow-none
          overflow-hidden
        `}
      >
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img
                src={NootLogo || "/placeholder.svg"}
                className="w-25 h-25"
                alt="Noot Logo"
              />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-100">
                Noot
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Från skaparen av Bebtlix
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img
                  src={NootLogo || "/placeholder.svg"}
                  className="w-25 h-25"
                  alt="Noot Logo"
                />
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-slate-900 dark:text-slate-100">
                  Noot
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Från skaparen av Bebtlix
                </p>
              </div>
              <DarkModeToggle
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </div>
          </div>

          <div className="pt-6 px-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
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

          <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-700 h-[100px]">
            <AddCategoryForm addCategory={addCategory} />
          </div>
        </div>
      </div>
    </>
  );
}
