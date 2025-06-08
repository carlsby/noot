import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import { NotebookPen } from "lucide-react";

export default function TaskArea({
  currentCategory,
  filteredTasks,
  addTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskOrder,
}) {
  return (
    <div
      className="flex-1 flex flex-col transition-colors duration-300 dark:bg-gray-900 bg-white"
    >
      <div
        className="px-8 py-2 lg:py-2 border-b transition-colors duration-300 dark:border-gray-700 border-gray-200 "
      >
        <div className="flex items-center ms-6 lg:ms-0 gap-2">
          <NotebookPen
            style={{ color: currentCategory?.color }}
          />
          <h1 className="text-2xl font-medium dark:text-white text-gray-900">
            {currentCategory?.name}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 hidden lg:block">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1 ? "anteckning" : "anteckningar"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          tasks={filteredTasks}
          updateTask={updateTask}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          updateTaskOrder={updateTaskOrder}
          categoryColor={currentCategory?.color}
        />
      </div>

      <div className="p-6 border-t transition-colors duration-300 dark:border-gray-700 border-gray-200">
        <AddTaskForm addTask={addTask} />
      </div>
    </div>
  );
}
