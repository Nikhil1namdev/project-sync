import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid"; // to generate unique task IDs

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white p-2 mb-2 rounded shadow cursor-grab"
    >
      {children}
    </div>
  );
};

const DroppableColumn = ({ id, title, children, isOver }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-1/3 p-4 rounded min-h-[200px] ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
};

const ToDolist = () => {
  const [create, setCreate] = useState(false);
  const [task, setTask] = useState("");
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [activeId, setActiveId] = useState(null);

  const toggleForm = () => setCreate(!create);

  const handleChange = (e) => setTask(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const newTask = { id, text: task };
    setColumns((prev) => ({
      ...prev,
      todo: [...prev.todo, newTask],
    }));
    setTask("");
    setCreate(false);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    let sourceColumn, destinationColumn;
    for (let key in columns) {
      if (columns[key].some((task) => task.id === active.id)) {
        sourceColumn = key;
      }
      if (key === over.id) destinationColumn = key;
    }

    if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
      const taskToMove = columns[sourceColumn].find((task) => task.id === active.id);
      setColumns((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((task) => task.id !== active.id),
        [destinationColumn]: [...prev[destinationColumn], taskToMove],
      }));
    }

    setActiveId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">To Do List</h1>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 mb-4">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <DroppableColumn
              key={columnId}
              id={columnId}
              title={columnId.replace(/([A-Z])/g, " $1").toUpperCase()}
            >
              {tasks.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                  {item.text}
                </DraggableItem>
              ))}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeId && (
            <div className="bg-white p-2 rounded shadow">{activeId}</div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="mt-4">
        {create && (
          <form onSubmit={handleSubmit} className="mb-2">
            <input
              type="text"
              value={task}
              onChange={handleChange}
              placeholder="Enter the task"
              className="border-2 p-1 mr-2"
            />
            <button type="submit" className="px-2 py-1 bg-green-500 text-white">
              Submit
            </button>
          </form>
        )}
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create
        </button>
      </div>
    </div>
  );
};

export default ToDolist;
