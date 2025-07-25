import TaskList from "./TaskList"
import AddTaskForm from "./AddTaskForm"
import { NotebookPen } from 'lucide-react'

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
    <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-950 min-h-screen">
      <div className="sticky top-0 z-10 h-[80px] bg-neutral-100/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="px-8 py-4">
          <div className="flex items-center gap-4 ms-6 lg:ms-0">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <NotebookPen style={{ color: currentCategory?.color }} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {currentCategory?.name}
              </h1>
              {/* <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                {filteredTasks.length} {filteredTasks.length === 1 ? "anteckning" : "anteckningar"}
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div>
          <TaskList
            tasks={filteredTasks}
            updateTask={updateTask}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
            updateTaskOrder={updateTaskOrder}
            categoryColor={currentCategory?.color}
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-neutral-100/95 dark:bg-neutral-950 backdrop-blur-sm border-t px-8 border-neutral-200 dark:border-neutral-700 flex items-center justify-center h-[95px]">
        <div className="max-w-3xl w-full mx-auto">
          <AddTaskForm addTask={addTask} />
        </div>
      </div>
    </div>
  )
}
