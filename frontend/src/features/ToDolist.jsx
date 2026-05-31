import React, { useState, useEffect, useContext } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import apiClient from "../utils/apiClient";
import LoginContext from "../../Context/LoginContext/CreateLoginContext";
import { showToast } from "../utils/toast";
import { Plus, Calendar, Layers, FolderKanban, Sparkles, User2 } from "lucide-react";
import GlobalCreateModal from "../components/GlobalCreateModal/GlobalCreateModal";

const DraggableItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.3 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-255 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-4 mb-3.5 rounded-xl shadow-md cursor-grab active:cursor-grabbing hover:border-blue-600 dark:hover:border-blue-500 transition select-none"
    >
      <div className="flex justify-between items-start gap-2.5 mb-2.5">
        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {task.title}
        </h4>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${getPriorityColor(task.priority)}`}>
          {task.priority || 'medium'}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mb-3.5 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t-2 border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center space-x-1.5 text-xs text-slate-800 dark:text-slate-250 font-bold">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}</span>
        </div>

        {task.assignee ? (
          <div className="flex items-center space-x-1.5">
            <div 
              title={task.assignee.name || 'Assignee'}
              className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-extrabold text-[10px] border-2 border-white dark:border-slate-800 shadow-sm shrink-0"
            >
              {getInitials(task.assignee.name)}
            </div>
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-250 max-w-[60px] truncate hidden sm:inline">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-350 flex items-center justify-center text-[10px] border border-slate-300 dark:border-slate-600 shrink-0">
            👤
          </div>
        )}
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, title, children, isOver }) => {
  const { setNodeRef } = useDroppable({ id });

  const getHeaderColor = () => {
    switch (id) {
      case 'todo': return 'border-t-4 border-t-indigo-600 dark:border-t-indigo-500';
      case 'in-progress': return 'border-t-4 border-t-sky-500 dark:border-t-sky-400';
      default: return 'border-t-4 border-t-emerald-500 dark:border-t-emerald-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[290px] p-5 rounded-2xl border-2 transition-all ${getHeaderColor()} ${
        isOver 
          ? "bg-blue-50 border-blue-400 dark:bg-slate-800 dark:border-blue-600 shadow-inner" 
          : "bg-slate-100/80 border-slate-250 dark:bg-slate-900 dark:border-slate-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <span className="text-[11px] font-black text-white bg-slate-800 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shadow">
          {React.Children.count(children) - 1}
        </span>
      </div>
      
      <div className="min-h-[300px]">
        {children}
      </div>
    </div>
  );
};

const ToDolist = () => {
  const { User } = useContext(LoginContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [columns, setColumns] = useState({
    todo: [],
    'in-progress': [],
    completed: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal Control States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  // Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Tasks whenever selected project changes
  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    } else {
      setColumns({ todo: [], 'in-progress': [], completed: [] });
    }
  }, [selectedProject]);

  // Listen to Global Creation refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchTasks();
    };
    window.addEventListener('refresh-tasks', handleRefresh);
    return () => {
      window.removeEventListener('refresh-tasks', handleRefresh);
    };
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/api/projects');
      const list = response.data.projects || [];
      setProjects(list);
      if (list.length > 0) {
        setSelectedProject(list[0]._id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/tasks/project/${selectedProject}`);
      const list = response.data.tasks || [];
      setColumns({
        todo: list.filter(t => t.status === 'todo'),
        'in-progress': list.filter(t => t.status === 'in-progress'),
        completed: list.filter(t => t.status === 'completed')
      });
    } catch (error) {
      console.error("Error loading project tasks:", error);
      showToast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // 'todo', 'in-progress', or 'completed'

    let currentStatus = null;
    for (const [colId, tasks] of Object.entries(columns)) {
      if (tasks.some(t => t._id === taskId)) {
        currentStatus = colId;
        break;
      }
    }

    if (currentStatus && currentStatus !== newStatus) {
      // Optimistically move task UI-side first
      const taskToMove = columns[currentStatus].find(t => t._id === taskId);
      const updatedTask = { ...taskToMove, status: newStatus };

      setColumns(prev => ({
        ...prev,
        [currentStatus]: prev[currentStatus].filter(t => t._id !== taskId),
        [newStatus]: [...prev[newStatus], updatedTask]
      }));

      try {
        await apiClient.patch(`/api/tasks/${taskId}`, { status: newStatus });
        showToast.success(`Task moved to ${newStatus === 'in-progress' ? 'In Progress' : newStatus === 'completed' ? 'Completed' : 'Todo'}`);
      } catch (error) {
        console.error("Status update error:", error);
        showToast.error("Failed to update status on server.");
        fetchTasks(); // Revert state from server
      }
    }

    setActiveId(null);
  };

  // Find dragged task for display overlay
  const getDraggedTask = () => {
    if (!activeId) return null;
    for (const col of Object.values(columns)) {
      const found = col.find(t => t._id === activeId);
      if (found) return found;
    }
    return null;
  };

  const activeDraggedTask = getDraggedTask();

  return (
    <div className="space-y-6">
      
      {/* Workspace Project Selection Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm select-none">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 text-white shrink-0 shadow-md shadow-blue-500/10">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">Board Workspace Sprints</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Filter sprint workflow by target active project</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-250">Select Active Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white dark:bg-slate-800 border-2 border-slate-350 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm transition hover:border-slate-400 dark:hover:border-slate-600"
          >
            {projects.length === 0 ? (
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold">No projects found</option>
            ) : (
              projects.map(p => (
                <option key={p._id} value={p._id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold">{p.title}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {loading ? (
        /* Board Shimmer Skeleton */
        <div className="flex gap-5 overflow-x-auto pb-4 select-none">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex-1 min-w-[290px] bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 animate-pulse">
              <div className="h-5 bg-slate-300 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
              <div className="h-28 bg-slate-200 dark:bg-slate-850 rounded-xl"></div>
              <div className="h-24 bg-slate-200 dark:bg-slate-850 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl py-16 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border-2 border-blue-100/50 dark:border-blue-900/30 shadow-sm">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Create your first project sprint</h3>
          <p className="text-slate-650 dark:text-slate-350 text-sm mt-2 max-w-sm leading-relaxed font-medium">
            Let's get your board workspace up and running! Create your first project sprint to start tracking active sprint task statuses.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Create first project
          </button>
        </div>
      ) : (
        /* Kanban Board with dnd-kit context */
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 overflow-x-auto pb-4 select-none">
            {Object.entries(columns).map(([columnId, tasks]) => (
              <DroppableColumn
                key={columnId}
                id={columnId}
                title={columnId === 'todo' ? 'To Do 📋' : columnId === 'in-progress' ? 'In Progress 🚀' : 'Completed ✅'}
              >
                {/* Dynamically List tasks */}
                {tasks.length === 0 ? (
                  /* Empty State inside Column */
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-12 mb-3 bg-white dark:bg-slate-800">
                    <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">No active tasks</span>
                  </div>
                ) : (
                  tasks.map((item) => (
                    <DraggableItem key={item._id} task={item} />
                  ))
                )}

                {/* Add task button in column */}
                <button
                  onClick={() => {
                    setDefaultStatus(columnId);
                    setShowCreateModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-3 mt-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition duration-150 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeId && activeDraggedTask && (
              <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 p-4 rounded-xl shadow-2xl scale-105 opacity-90">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-1">
                  {activeDraggedTask.title}
                </h4>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Creation Modal using common GlobalCreateModal */}
      <GlobalCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialProjectId={selectedProject}
        initialType="task"
        onSuccess={() => {
          fetchTasks();
          window.dispatchEvent(new CustomEvent('refresh-tasks'));
        }}
      />
    </div>
  );
};

export default ToDolist;
