import React, { useState, useEffect } from "react";
import { NotebookPen } from "lucide-react";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TaskList({
  tasks,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskOrder,
}) {
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    setLocalTasks(sortedTasks);
  }, [tasks]);
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // Om släpptes utanför listan, avbryt
    if (!destination) return;

    // Om uppgiften släpptes på samma plats, avbryt
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Skapa en kopia av local tasks
    const updatedTasks = Array.from(localTasks);

    // Ta bort den flyttade uppgiften från orignal plats, gamla plats + 1 (flyttas ner 1 steg)
    const [movedTask] = updatedTasks.splice(source.index, 1);

    // Sätt in uppgiften på den nya positionen
    updatedTasks.splice(destination.index, 0, movedTask);

    // Uppdatera local tasks
    setLocalTasks(updatedTasks);

    const tasksToUpdate = updatedTasks.map((task, index) => ({
      _id: task._id,
      order: index,
    }));

    await updateTaskOrder(tasksToUpdate);
  };

  if (localTasks.length === 0) {
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks-list" direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <ul
            className="space-y-3 max-w-3xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {localTasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <li ref={provided.innerRef} {...provided.draggableProps}>
                    <TaskItem
                      task={task}
                      updateTask={updateTask}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteTask}
                      dragHandleProps={provided.dragHandleProps}
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
