import React, { useState, useEffect } from "react";
import { NotebookPen } from "lucide-react";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function TaskList({
  tasks,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskOrder,
  categoryColor,
}) {
  const [localTasks, setLocalTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // Om släppter utanför listan, avbryt
    if (!destination) return;

    // Om släppter på samma plats, avbryt
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedTasks = Array.from(localTasks);

    // Ta bort uppgiften från dess ursprungliga plats
    const [movedTask] = updatedTasks.splice(source.index, 1);

    // Hitta första index där uppgiften är markerad som klar
    const firstCompletedIndex = updatedTasks.findIndex(
      (task) => task.completed
    );

    // Om en icke-avklarad uppgift försöker flyttas under en avklarad, avbryt
    const isMovingIncompleteBelowCompleted =
      !movedTask.completed &&
      firstCompletedIndex !== -1 &&
      destination.index >= firstCompletedIndex;

    if (isMovingIncompleteBelowCompleted) {
      return; // Avbryt drag
    }

    // Sätt in uppgiften på den nya platsen
    updatedTasks.splice(destination.index, 0, movedTask);

    setLocalTasks(updatedTasks);

    // Uppdatera sorteringsordningen i backend
    const tasksToUpdate = updatedTasks.map((task, index) => ({
      _id: task._id,
      order: index,
    }));

    await updateTaskOrder(tasksToUpdate);
  };

  useEffect(() => {
    const sortedTasks = [...tasks]
      .sort((a, b) => a.order - b.order)
      .sort((a, b) => a.completed - b.completed);

    setLocalTasks(sortedTasks);
  }, [tasks]);

  if (localTasks.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-12">
        <div className="flex flex-col items-center justify-center h-full">
          <NotebookPen
            style={{ color: categoryColor }}
            size={40}
            className="mb-4"
          />
          <p className="text-lg dark:text-gray-300">Inga anteckningar ännu</p>
          <p className="text-sm dark:text-gray-400">
            Lägg till en anteckning nedan
          </p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="tasks-list"
        direction="vertical"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {localTasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} className="mb-2">
                    <TaskItem
                      task={task}
                      updateTask={updateTask}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteTask}
                      dragHandleProps={provided.dragHandleProps}
                      editingTaskId={editingTaskId}
                      setEditingTaskId={setEditingTaskId}
                    />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
