import { ChevronRight, FileText, PanelLeft } from "lucide-react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

export default function TaskArea({ currentCategory, filteredTasks, addTask, updateTask, toggleTaskCompletion, deleteTask, updateTaskOrder, onToggleSidebar }) {
  return (
    <main className="task-area">
      <header className="workspace-toolbar">
        <button type="button" className="icon-button" title="Visa eller dölj sidomenyn (Ctrl+Shift+B)" aria-label="Visa eller dölj sidomenyn" onClick={onToggleSidebar}><PanelLeft size={20} /></button>
        {currentCategory && <span className="workspace-count">{filteredTasks.length} {filteredTasks.length === 1 ? "anteckning" : "anteckningar"}</span>}
      </header>

      {!currentCategory ? (
        <div className="workspace-empty">
          <div className="workspace-empty-icon"><FileText size={28} /></div>
          <h1>Välj en fil för att börja</h1>
          <p>Dina filer och mappar finns i sidomenyn.</p>
        </div>
      ) : (
        <>
          <div className="document-scroll">
            <article className="document-page">
              <div className="document-heading">
                <h1>{currentCategory.name}</h1>
              </div>
              <TaskList tasks={filteredTasks} updateTask={updateTask} toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask} updateTaskOrder={updateTaskOrder} categoryColor={currentCategory.color} />
            </article>
          </div>
          <div className="composer-dock"><div className="composer-inner"><AddTaskForm addTask={addTask} /></div></div>
        </>
      )}
    </main>
  );
}
