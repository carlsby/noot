import { NotepadText, Paintbrush } from "lucide-react";

export default function TabNavigation({
  activeTab,
  setActiveTab,
  setPaintMode,
  paintings,
  setSelectedPainting,
}) {
  const tabs = [
    {
      id: "note",
      label: "Anteckningar",
      icon: NotepadText,
      action: false,
    },
    {
      id: "paint",
      label: "Målningar",
      icon: Paintbrush,
      action: true,
    },
  ];

  const toggleTab = (tab) => {
    setPaintMode(tab.action);
    setActiveTab(tab.id);

    if (tab.id === "paint" && paintings.length > 0) {
      const sorted = [...paintings].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setSelectedPainting(sorted[0]);
    }
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <div className="flex bg-slate-100 dark:bg-slate-800 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => toggleTab(tab)}
              className={`
                relative flex items-center justify-center gap-2 px-4 py-2.5
                text-sm font-medium transition-all duration-200 ease-out
                flex-1
                ${
                  isActive
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>

              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
