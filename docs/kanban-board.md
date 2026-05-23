# Kanban Board (Todo List)

## 1. Feature Overview
The Kanban Board is a highly visual project tracker mirroring Jira's task boards. It lets users define tasks under specific status columns ("TODO", "IN PROGRESS", "DONE") and move them interactively using responsive HTML5 pointer drag triggers.

- **Status:** **Partially Implemented** (Fully interactive UI, local state drag-and-drop, missing persistent backend CRUD synchronization).

---

## 2. What I Learned
- **@dnd-kit/core Library:** Implementing advanced react-focused drag and drop interactions without dealing with direct, unstable HTML5 drag-and-drop event APIs.
- **Draggable & Droppable Node Refs:** Binding sensors, listeners, and styles to specific DOM nodes dynamically.
- **DndContext & DragOverlays:** Orchestrating boundary collisions and projecting clean absolute-positioned visual overlays during dragging.
- **Immutability in Complex Object States:** Moving objects cleanly from one array nested inside a state object into another array without modifying references directly.

---

## 3. How It Was Used In This Project
The Kanban board is built inside a standalone workspace feature.
- **File References:**
  - Component: `frontend/src/features/ToDolist.jsx`
  - Routes: `frontend/src/App.jsx` (Registered on `/ToDoList` under a protected wrapper)

### Frontend Interaction Logic
1. **Adding Tasks:** The user opens a creation form, inputs a title, and hits "Submit". A new task object `{ id: uuidv4(), text: task }` is initialized and pushed into the local state `columns.todo` list.
2. **Dragging Tasks:** Clicking and holding a task initializes `@dnd-kit`'s `useDraggable` sensors. It stores the active task identifier in `activeId`.
3. **Collision Detection:** As the user moves the item across the viewport, collision detectors (`closestCenter`) locate the nearest active `useDroppable` column boundaries.
4. **Moving Tasks:** Releasing the pointer fires the `onDragEnd` trigger:
   - Locates the task inside the `sourceColumn` array.
   - Removes it from the `sourceColumn` via `.filter()`.
   - Appends it to the `destinationColumn` via the spread operator.

---

## 4. Project Architecture Notes
- **dnd-kit Integration:** Uses a wrapper context:
  ```jsx
  <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Droppable columns */}
      <DragOverlay>{/* Active drag indicator */}</DragOverlay>
  </DndContext>
  ```
- **State Structure:**
  ```javascript
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  ```

---

## 5. Important Code Flow (Interview Preparation)
1. **User Submits Task:** Form fires `handleSubmit`, appends task object with `uuidv4()` to `columns.todo`.
2. **Drag Starts:** User drags a task. `handleDragStart` sets `activeId`.
3. **Drag Ends:** User drops task over "IN PROGRESS". `handleDragEnd` is invoked with `event.active.id` and `event.over.id`.
4. **Locating Columns:** Loop identifies which state key (`todo`, `inProgress`, or `done`) contains the active task.
5. **State Splice & Transition:**
   ```javascript
   setColumns((prev) => ({
     ...prev,
     [sourceColumn]: prev[sourceColumn].filter((task) => task.id !== active.id),
     [destinationColumn]: [...prev[destinationColumn], taskToMove],
   }));
   ```
6. **Re-rendering:** React diffs components and places the element in the appropriate column container.

---

## 6. Future Backend & Production Improvements
- **Database Persistence:** Hook up the board to backend models. When `onDragEnd` is completed successfully, dispatch an HTTP PUT API request (`axios.put('http://localhost:8000/List/:id')`) to update the task status column in MongoDB permanently.
- **Optimistic Updates:** Update frontend state instantly when drag-and-drop happens, and revert back if the backend HTTP call fails, to keep the UI snappy.
- **Websocket Real-time Board Sync:** Broadcast the dropped task's new column location to all other team members currently browsing the same dashboard in real time using Socket.io (`socket.emit('boardUpdate')`).
