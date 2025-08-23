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
    <div className="border-b border-neutral-200 dark:border-neutral-700 space:border-indigo-400">
      <div className="flex bg-neutral-100 dark:bg-neutral-800 gap-1 space:bg-indigo-400">
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
                    ? "bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm space:bg-indigo-400 space:text-indigo-950"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 space:bg-gray-950 space:text-gray-600"
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>

              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-500/10 to-neutral-500/10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
