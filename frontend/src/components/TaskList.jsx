import { NotebookPen } from "lucide-react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-12">
        <div className="flex flex-col items-center justify-center h-full">
          <NotebookPen size={40} className="mb-4" />
          <p className="text-lg dark:text-gray-300">Inga uppgifter ännu</p>
          <p className="text-sm dark:text-gray-400">
            Lägg till en uppgift nedan
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3 max-w-3xl mx-auto">
      {tasks.map((task) => (
        <li key={task._id} className="group">
          <TaskItem
            task={task}
            updateTask={updateTask}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        </li>
      ))}
    </ul>
  );
}
