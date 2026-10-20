import { useState, useEffect } from "react";
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

    const incompleteCount = updatedTasks.filter((task) => !task.completed).length;
    const crossesCompletionGroup = movedTask.completed
      ? destination.index < incompleteCount
      : destination.index > incompleteCount;
    if (crossesCompletionGroup) return;

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
      <div className="document-empty">
        <NotebookPen style={{ color: categoryColor || "var(--accent)" }} size={26} />
        <strong>Inga anteckningar ännu</strong>
        <span>Skriv din första anteckning nedan.</span>
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
            className="note-list"
          >
            {localTasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} className="note-row">
                    <TaskItem
                      task={task}
                      updateTask={updateTask}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteTask}
                      dragHandleProps={provided.dragHandleProps}
                      editingTaskId={editingTaskId}
                      setEditingTaskId={setEditingTaskId}
                      isDragging={snapshot.isDragging}
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
