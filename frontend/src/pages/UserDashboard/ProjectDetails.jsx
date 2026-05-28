import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { 
  Settings, 
  FolderKanban, 
  LogOut, 
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  Briefcase,
  Layers,
  ArrowLeft,
  CheckCircle,
  Circle,
  TrendingUp,
  FileText
} from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState('Dashboard');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Task Modal States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = Create, object = Edit
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  // Active Task Filter States
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Kanban & Drag-Drop States
  const [viewMode, setViewMode] = useState('kanban'); // default to kanban board
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Activity Timeline States
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Delete Task States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Load authenticated profile
  const userProfile = (() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        return JSON.parse(info);
      } catch (e) {
        console.error("Error loading user profile details:", e);
      }
    }
    return null;
  })();

  const userName = userProfile?.name || 'User';
  const token = userProfile?.token;

  // Initials generator
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Relative time formatter
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Due status helper
  const getTaskDueStatus = (task) => {
    if (!task || !task.dueDate || task.status === 'completed') {
      return 'normal';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDateObj = new Date(task.dueDate);
    dueDateObj.setHours(0, 0, 0, 0);

    if (dueDateObj < today) {
      return 'overdue';
    }

    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    if (dueDateObj >= today && dueDateObj <= twoDaysLater) {
      return 'due-soon';
    }

    return 'normal';
  };

  // FETCH PROJECT DATA BY ID
  const fetchProjectDetails = async () => {
    if (!token) return;
    setProjectLoading(true);
    try {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      setProject(response.data.project);
    } catch (error) {
      console.error("Fetch Project Details Error:", error);
      showToast.error("Failed to load project parameters.");
      navigate('/UserDashboard');
    } finally {
      setProjectLoading(false);
    }
  };

  // FETCH TASKS FOR THIS PROJECT
  const fetchTasks = async () => {
    if (!token) return;
    setTasksLoading(true);
    try {
      const response = await apiClient.get(`/api/tasks/project/${projectId}`);
      setTasks(response.data.tasks || []);
      fetchActivities(); // Automatically sync activity logs
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
      showToast.error("Failed to load tasks list.");
    } finally {
      setTasksLoading(false);
    }
  };

  // FETCH ACTIVITIES FOR THIS PROJECT
  const fetchActivities = async () => {
    if (!token) return;
    setActivitiesLoading(true);
    try {
      const response = await apiClient.get(`/api/activity/project/${projectId}`);
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error("Fetch Activities Error:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjectDetails();
      fetchTasks();
      fetchActivities();
    } else {
      navigate('/Login');
    }
  }, [projectId, token]);

  // PROGRESS CALCULATIONS
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Due status counts
  const overdueCount = tasks.filter(t => getTaskDueStatus(t) === 'overdue').length;
  const dueSoonCount = tasks.filter(t => getTaskDueStatus(t) === 'due-soon').length;

  // Dynamic filtering of tasks list using useMemo
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchStatus && matchPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  // Live Task Counts for UI Display
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;

  // Kanban Column Lists (filtered by active priority Filter)
  const kanbanTodoTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'todo' && (priorityFilter === 'all' || t.priority === priorityFilter));
  }, [tasks, priorityFilter]);

  const kanbanInProgressTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'in-progress' && (priorityFilter === 'all' || t.priority === priorityFilter));
  }, [tasks, priorityFilter]);

  const kanbanCompletedTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'completed' && (priorityFilter === 'all' || t.priority === priorityFilter));
  }, [tasks, priorityFilter]);

  // Dynamic badge styling helper for premium progress stats
  const getProgressBadgeStyles = (percentage) => {
    if (percentage === 0) {
      return "text-slate-600 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 shadow-[0_0_6px_rgba(148,163,184,0.05)]";
    }
    if (percentage === 100) {
      return "text-green-700 dark:text-green-300 bg-green-50/90 dark:bg-green-950/40 border border-green-200/80 dark:border-green-800/40 shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.15)]";
    }
    return "text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/40 shadow-sm dark:shadow-[0_0_10px_rgba(59,130,246,0.15)]";
  };

  const handleNavClick = (label) => {
    setActiveItem(label);
    if (label === "Pricing") {
      navigate('/PricingPage');
    } else if (label === "Dashboard") {
      navigate('/UserDashboard');
    }
  };

  const handleJiraClick = () => {
    navigate('/JiraDashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setLogin(false);
    setUser(null);
    setToken(null);
    showToast.success("Logged out successfully.");
    navigate('/Login', { replace: true });
  };

  // OPEN CREATE TASK MODAL
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus('todo');
    setTaskPriority('medium');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setShowTaskModal(true);
  };

  // OPEN EDIT TASK MODAL
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskStatus(task.status || 'todo');
    setTaskPriority(task.priority || 'medium');
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setShowTaskModal(true);
  };

  // SUBMIT TASK (CREATE OR PATCH)
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) {
      showToast.error("Title and Due Date are required.");
      return;
    }

    setTaskSubmitting(true);
    try {
      const payload = {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        projectId: projectId
      };

      if (editingTask) {
        // PATCH Task
        await apiClient.patch(`/api/tasks/${editingTask._id}`, payload);
        showToast.success("Task updated successfully!");
      } else {
        // POST Task
        await apiClient.post('/api/tasks', payload);
        showToast.success("Task created successfully!");
      }

      setShowTaskModal(false);
      fetchTasks(); // Refresh tasks grid
    } catch (error) {
      console.error("Task submission error:", error);
      const msg = error.response?.data?.message || "Failed to save task parameters.";
      showToast.error(msg);
    } finally {
      setTaskSubmitting(false);
    }
  };

  // QUICK UPDATE STATUS HANDLER
  const handleQuickStatusChange = async (task, newStatus) => {
    try {
      await apiClient.patch(`/api/tasks/${task._id}`, { status: newStatus });
      showToast.success(`Task moved to ${newStatus}`);
      fetchTasks();
    } catch (error) {
      console.error("Quick status update error:", error);
      showToast.error("Failed to update task status.");
    }
  };

  // TRIGGER DELETE MODAL
  const handleTriggerDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // CONFIRM ACTION DELETE TASK
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteSubmitting(true);
    try {
      await apiClient.delete(`/api/tasks/${taskToDelete._id}`);
      showToast.success("Task successfully removed.");
      setShowDeleteModal(false);
      fetchTasks(); // Reload
    } catch (error) {
      console.error("Delete Task Error:", error);
      showToast.error("Failed to delete task.");
    } finally {
      setDeleteSubmitting(false);
      setTaskToDelete(null);
    }
  };

  // ==========================================
  // NATIVE DRAG & DROP HANDLERS FOR KANBAN
  // ==========================================
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", task._id);
    setDraggedTaskId(task._id);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (!taskId) return;

    const targetTask = tasks.find(t => t._id === taskId);
    if (!targetTask || targetTask.status === columnId) return;

    // Optimistic UI Update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t => 
      t._id === taskId ? { ...t, status: columnId } : t
    );
    setTasks(updatedTasks);

    try {
      await apiClient.patch(`/api/tasks/${taskId}`, { status: columnId });
      showToast.success(`Task moved to ${columnId === 'in-progress' ? 'In Progress' : columnId === 'todo' ? 'Todo' : 'Completed'}`);
      fetchActivities(); // Refresh activity log after drop
    } catch (error) {
      console.error("Failed to move task:", error);
      showToast.error("Failed to save task status change.");
      setTasks(originalTasks); // Rollback
    }
  };

  const renderKanbanTaskCard = (task) => {
    const isCurrentlyDragged = draggedTaskId === task._id;
    
    const priorityStyles = {
      low: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
      medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30",
      high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-900/30"
    };

    const dueStatus = getTaskDueStatus(task);
    const borderGlowClass = 
      dueStatus === 'overdue' 
        ? "border-rose-500/60 dark:border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)] dark:shadow-[0_0_12px_rgba(244,63,94,0.1)]" 
        : dueStatus === 'due-soon'
          ? "border-amber-500/40 dark:border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.08)]"
          : "border-slate-200/60 dark:border-slate-800/80";

    const dateColorClass = 
      dueStatus === 'overdue' 
        ? "text-rose-500 dark:text-rose-400 font-extrabold" 
        : dueStatus === 'due-soon'
          ? "text-amber-500 dark:text-amber-400 font-extrabold"
          : "text-slate-400 dark:text-slate-500 font-semibold";

    return (
      <div
        key={task._id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        className={`bg-white dark:bg-slate-900 border ${borderGlowClass} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-500/50 cursor-grab active:cursor-grabbing select-none relative group ${
          isCurrentlyDragged ? "opacity-35 scale-95 border-dashed border-blue-500" : ""
        }`}
      >
        {/* Priority Badge & Actions */}
        <div className="flex justify-between items-start mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${priorityStyles[task.priority || 'medium']}`}>
              {task.priority}
            </span>
            {dueStatus === 'overdue' && (
              <span className="bg-rose-500 text-white dark:bg-rose-955/40 dark:text-rose-400 border border-rose-600/20 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded select-none animate-pulse">
                Overdue
              </span>
            )}
            {dueStatus === 'due-soon' && (
              <span className="bg-amber-500 text-white dark:bg-amber-955/40 dark:text-amber-400 border border-amber-600/20 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded select-none">
                Due Soon
              </span>
            )}
          </div>
          
          <div className="flex space-x-1 shrink-0">
            <button
              onClick={() => handleOpenEditModal(task)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleTriggerDelete(task)}
              className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-400 hover:text-red-600 transition cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h5 className="font-extrabold text-slate-800 dark:text-white text-sm leading-snug mb-1 line-clamp-1">
          {task.title}
        </h5>

        {/* Task Description */}
        <p className="text-[11px] text-slate-500 dark:text-slate-450 line-clamp-2 leading-relaxed mb-4">
          {task.description ? task.description : <span className="italic text-slate-350 dark:text-slate-655 font-medium">No details provided.</span>}
        </p>

        {/* Due Date Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px]">
          <span className={`${dateColorClass} flex items-center space-x-1`}>
            <Calendar className="w-3 h-3" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </span>

          <span className={`text-[8px] font-black uppercase px-2 py-0.25 rounded border shrink-0 ${
            task.status === 'completed' 
              ? "bg-green-50/50 text-green-600 border-green-200/50 dark:bg-green-955/10 dark:text-green-400" 
              : task.status === 'in-progress' 
              ? "bg-blue-50/50 text-blue-600 border-blue-200/50 dark:bg-blue-955/10 dark:text-blue-400" 
              : "bg-slate-100/50 text-slate-500 border-slate-200/50 dark:bg-slate-800/10 dark:text-slate-400"
          }`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status}
          </span>
        </div>
      </div>
    );
  };

  const renderKanbanColumn = (columnId, title, columnTasks, columnBgClass, titleBadgeClass) => {
    const isOver = dragOverColumn === columnId;
    return (
      <div 
        onDragOver={(e) => handleDragOver(e, columnId)}
        onDragLeave={() => setDragOverColumn(null)}
        onDrop={(e) => handleDrop(e, columnId)}
        className={`flex flex-col rounded-2xl p-4 border transition-all duration-300 min-h-[480px] ${columnBgClass} ${
          isOver 
            ? "ring-2 ring-blue-500/50 border-blue-500/50 bg-blue-50/5 dark:bg-blue-955/5 scale-[1.01]" 
            : ""
        }`}
      >
        {/* Column Title Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/30 dark:border-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              columnId === 'todo' ? 'bg-slate-400' : columnId === 'in-progress' ? 'bg-amber-500' : 'bg-green-500'
            }`} />
            <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-sm tracking-tight capitalize">{title}</h4>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${titleBadgeClass}`}>
            {columnTasks.length}
          </span>
        </div>

        {/* Column Scrollable Tasks Container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[500px] scrollbar-thin">
          {columnTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200/40 dark:border-slate-800/50 rounded-xl py-12 text-center select-none bg-slate-50/20 dark:bg-slate-900/10">
              <span className="text-xl mb-1.5 opacity-60">📥</span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Empty Column</p>
            </div>
          ) : (
            columnTasks.map(task => renderKanbanTaskCard(task))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between select-none border-r border-slate-200/60 dark:border-slate-800 relative">
        <div>
          {/* Project-Sync Branding - Clickable to return to public homepage */}
          <Link 
            to="/" 
            className="flex items-center space-x-2.5 px-6 py-5 border-b border-slate-100 dark:border-slate-800 pb-4 mb-8 group cursor-pointer"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-[15px] font-bold text-slate-800 dark:text-white tracking-tight">
              Project-<span className="text-blue-600">Sync</span>
            </span>
          </Link>

          <nav className="space-y-1.5 px-4">
            <NavItem label="Dashboard" active={activeItem === "Dashboard"} onClick={() => navigate('/UserDashboard')} icon={<Layers className="w-4 h-4" />} />
            <NavItem label="Workspace Sprints" active={false} onClick={handleJiraClick} icon={<FolderKanban className="w-4 h-4" />} />
            <NavItem label="Pricing Plan" active={activeItem === "Pricing"} onClick={() => handleNavClick("Pricing")} icon={<Briefcase className="w-4 h-4" />} />
          </nav>
        </div>

        {/* Dynamic User Profile Indicator */}
        <div className="p-4 relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {userProfile?.profilepic && !imgError ? (
                <img 
                  src={userProfile.profilepic} 
                  alt={userName} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-xs shadow-sm shrink-0">
                  {getInitials(userName)}
                </div>
              )}
              <div className="overflow-hidden text-left">
                <div className="font-bold text-slate-800 dark:text-white text-[12px] truncate max-w-[110px]">{userName}</div>
                <div className="text-[9px] text-slate-400 font-semibold truncate max-w-[110px]">{userProfile?.email || 'Developer Member'}</div>
              </div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* Premium Profile Actions Overlay */}
          {showProfileMenu && (
            <div className="absolute bottom-16 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-2 z-50 select-none">
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{userName}</div>
                <div className="text-[9px] text-slate-400 font-semibold truncate">{userProfile?.email || 'Developer Member'}</div>
              </div>
              <button 
                onClick={() => { setShowProfileMenu(false); handleJiraClick(); }}
                className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:text-blue-600 transition text-left cursor-pointer"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Go to Workspace</span>
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
              <button 
                onClick={() => { setShowProfileMenu(false); setShowLogoutModal(true); }}
                className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-955/30 transition text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Board Content */}
      <div className="flex-1 overflow-y-auto p-8 sm:p-12">
        
        {/* Back navigation and notifications */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/UserDashboard')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          
          <NotificationBell />
        </div>

        {/* PROJECT META HERO CARD */}
        {projectLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 animate-pulse mb-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
          </div>
        ) : project && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center space-x-3.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {project.title}
                  </h1>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full select-none">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {project.description ? project.description : <span className="italic text-slate-300 dark:text-slate-600">No project description has been added.</span>}
                </p>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Grid Metadata details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-5 my-6">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Priority</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize block">{project.priority}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Start Date</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">{formatDate(project.startDate)}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Due Date</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">{formatDate(project.dueDate)}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Created Date</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Task completion statistics bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-extrabold mb-2.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 animate-pulse">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Task Sprint Completion Progress</span>
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${getProgressBadgeStyles(completionPercentage)}`}>
                  {completionPercentage}% Complete ({completedTasksCount}/{totalTasksCount} tasks)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 select-none overflow-hidden border border-slate-200/20">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Task due status indicators */}
            {(overdueCount > 0 || dueSoonCount > 0) && (
              <div className="flex flex-wrap gap-2.5 mt-4 pt-1.5 select-none">
                {overdueCount > 0 && (
                  <div className="flex items-center space-x-1.5 bg-rose-50/50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/40 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 relative"></span>
                    <span>{overdueCount} Overdue {overdueCount === 1 ? 'Task' : 'Tasks'}</span>
                  </div>
                )}
                {dueSoonCount > 0 && (
                  <div className="flex items-center space-x-1.5 bg-amber-50/50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-950/40 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>{dueSoonCount} Due Soon</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TASKS DETAILS GRID AND TIMELINE WRAPPER */}
        <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
          
          {/* SPRINT WORKSPACE */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Tasks Sprint</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Manage and track individual workspace tasks
              </p>
            </div>
            
            {/* Dynamic Filter Navigation Tabs & Live Counts */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Toggle: Kanban Board vs List View */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shrink-0 mr-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 flex items-center space-x-1.5 cursor-pointer ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/30 dark:border-slate-800/50'
                      : 'text-slate-555 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Kanban Board</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 flex items-center space-x-1.5 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/30 dark:border-slate-800/50'
                      : 'text-slate-555 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>

              {viewMode === 'list' && (
                <>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer select-none ${
                      statusFilter === 'all'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All</span>
                    <span className={`px-1.5 py-0.25 rounded text-[9px] font-black ${statusFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      {totalCount}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setStatusFilter('todo')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer select-none ${
                      statusFilter === 'todo'
                        ? 'bg-slate-600 dark:bg-slate-800 border-slate-600 dark:border-slate-700 text-white shadow-md shadow-slate-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Todo</span>
                    <span className={`px-1.5 py-0.25 rounded text-[9px] font-black ${statusFilter === 'todo' ? 'bg-slate-700 dark:bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      {todoCount}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setStatusFilter('in-progress')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer select-none ${
                      statusFilter === 'in-progress'
                        ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>In Progress</span>
                    <span className={`px-1.5 py-0.25 rounded text-[9px] font-black ${statusFilter === 'in-progress' ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      {inProgressCount}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer select-none ${
                      statusFilter === 'completed'
                        ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Completed</span>
                    <span className={`px-1.5 py-0.25 rounded text-[9px] font-black ${statusFilter === 'completed' ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      {completedCount}
                    </span>
                  </button>

                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
                </>
              )}

              {/* Dynamic Priority Filter Dropdown */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold border bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none cursor-pointer select-none"
              >
                <option value="all">All Priorities ⚡</option>
                <option value="low">Low Priority 🟢</option>
                <option value="medium">Medium Priority 🟡</option>
                <option value="high">High Priority 🔴</option>
              </select>
            </div>
          </div>

          {tasksLoading ? (
            /* Loading task shimmers */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 pt-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            /* Clean Empty state */
            <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl py-16 sm:py-20 max-w-md mx-auto shadow-sm select-none">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">No tasks registered</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5 mb-6 max-w-xs leading-relaxed">
                There are currently no tasks allocated to this project workspace. Click below to add your first task!
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition cursor-pointer"
              >
                Add first task
              </button>
            </div>
          ) : viewMode === 'kanban' ? (
            /* Kanban Board Column View */
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-4 select-none">
              {renderKanbanColumn("todo", "Todo", kanbanTodoTasks, "bg-slate-100/30 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/85", "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800")}
              {renderKanbanColumn("in-progress", "In Progress", kanbanInProgressTasks, "bg-amber-50/10 dark:bg-amber-955/5 border-amber-200/40 dark:border-amber-900/20", "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/20")}
              {renderKanbanColumn("completed", "Completed", kanbanCompletedTasks, "bg-green-50/10 dark:bg-green-955/5 border-green-200/40 dark:border-green-900/20", "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-955/20")}
            </div>
          ) : filteredTasks.length === 0 ? (
            /* Clean Empty state for filtered subset (List View) */
            <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl py-14 max-w-md mx-auto shadow-sm select-none">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">No matching tasks</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5 mb-2 max-w-xs leading-relaxed">
                No active tasks match your selected status or priority filter parameters. Try clearing your filters!
              </p>
            </div>
          ) : (
            /* List View Grid display list */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => {
                const priorityStyles = {
                  low: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
                  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30",
                  high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-900/30"
                };

                const dueStatus = getTaskDueStatus(task);
                const borderGlowClass = 
                  dueStatus === 'overdue' 
                    ? "border-rose-500/60 dark:border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)] dark:shadow-[0_0_12px_rgba(244,63,94,0.1)]" 
                    : dueStatus === 'due-soon'
                      ? "border-amber-500/40 dark:border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.08)]"
                      : "border-slate-200/60 dark:border-slate-800";

                const dateColorClass = 
                  dueStatus === 'overdue' 
                    ? "text-rose-500 dark:text-rose-400 font-extrabold" 
                    : dueStatus === 'due-soon'
                      ? "text-amber-500 dark:text-amber-400 font-extrabold"
                      : "text-slate-400 dark:text-slate-500 font-semibold";

                return (
                  <div 
                    key={task._id} 
                    className={`bg-white dark:bg-slate-900 border ${borderGlowClass} rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuickStatusChange(task, task.status === 'completed' ? 'todo' : 'completed')}
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                            title={task.status === 'completed' ? "Mark Active" : "Mark Complete"}
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                            ) : (
                              <Circle className="w-4.5 h-4.5" />
                            )}
                          </button>
                          <h4 className={`font-bold text-slate-800 dark:text-white text-sm line-clamp-1 leading-snug ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                            {task.title}
                          </h4>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => handleQuickStatusChange(task, e.target.value)}
                          className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border bg-transparent cursor-pointer outline-none shrink-0"
                          style={{
                            borderColor: task.status === 'completed' ? 'rgba(34, 197, 94, 0.4)' : task.status === 'in-progress' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(148, 163, 184, 0.4)',
                            color: task.status === 'completed' ? '#22c55e' : task.status === 'in-progress' ? '#3b82f6' : '#94a3b8'
                          }}
                        >
                          <option value="todo" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">TODO</option>
                          <option value="in-progress" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">IN PROGRESS</option>
                          <option value="completed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">COMPLETED</option>
                        </select>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed pl-6.5">
                        {task.description ? task.description : <span className="italic text-slate-300 dark:text-slate-600">No details provided.</span>}
                      </p>
                    </div>

                    {/* Metadata actions row */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-2 flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-2 pl-6.5">
                        <span className={`px-2 py-0.5 rounded border font-semibold ${priorityStyles[task.priority || 'medium']}`}>
                          {task.priority}
                        </span>
                        {dueStatus === 'overdue' && (
                          <span className="bg-rose-500 text-white dark:bg-rose-955/40 dark:text-rose-400 border border-rose-600/20 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded select-none animate-pulse">
                            Overdue
                          </span>
                        )}
                        {dueStatus === 'due-soon' && (
                          <span className="bg-amber-500 text-white dark:bg-amber-955/40 dark:text-amber-400 border border-amber-600/20 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded select-none">
                            Due Soon
                          </span>
                        )}
                        
                        <span className={`${dateColorClass} flex items-center space-x-1`}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex space-x-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(task)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTriggerDelete(task)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
          </div> {/* End of SPRINT WORKSPACE */}

          {/* RECENT ACTIVITY TIMELINE */}
          <div className="w-full xl:w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm self-start">
            <h3 className="text-sm font-black text-slate-950 dark:text-white mb-4 tracking-tight flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Sprint Activity Feed</span>
            </h3>

            {activitiesLoading ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex space-x-3 items-start animate-pulse">
                    <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0 mt-0.5"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 select-none bg-slate-50/20 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200/40 dark:border-slate-850">
                <span className="text-xl mb-1.5 opacity-60">🔔</span>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Empty Log</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 px-3 leading-normal">
                  No activity actions recorded for this project yet.
                </p>
              </div>
            ) : (
              <div className="relative border-l border-slate-100 dark:border-slate-800/80 pl-4.5 space-y-5 ml-2.5 py-1">
                {activities.map((item) => {
                  // Determine icon mapping & background styles
                  const iconConfig = {
                    project_created: {
                      icon: <Briefcase className="w-2.5 h-2.5" />,
                      styles: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-955/20 dark:text-blue-400 dark:border-blue-900/40"
                    },
                    project_updated: {
                      icon: <Briefcase className="w-2.5 h-2.5" />,
                      styles: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-955/20 dark:text-indigo-400 dark:border-indigo-900/40"
                    },
                    task_created: {
                      icon: <Plus className="w-2.5 h-2.5" />,
                      styles: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-900/40"
                    },
                    task_updated: {
                      icon: <Edit3 className="w-2.5 h-2.5" />,
                      styles: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/40"
                    },
                    task_deleted: {
                      icon: <Trash2 className="w-2.5 h-2.5" />,
                      styles: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-900/40"
                    },
                    task_status_changed: {
                      icon: <Layers className="w-2.5 h-2.5" />,
                      styles: "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-955/20 dark:text-sky-400 dark:border-sky-900/40"
                    },
                    task_completed: {
                      icon: <CheckCircle className="w-2.5 h-2.5" />,
                      styles: "bg-green-50 text-green-600 border-green-200 dark:bg-green-955/20 dark:text-green-400 dark:border-green-900/40"
                    }
                  };

                  const currentStyle = iconConfig[item.type] || {
                    icon: <Clock className="w-2.5 h-2.5" />,
                    styles: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                  };

                  return (
                    <div key={item._id} className="relative pl-1.5 transition-all duration-300 hover:translate-x-0.5 select-none">
                      {/* Floating Circle Anchor */}
                      <span className={`absolute -left-[30px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm ${currentStyle.styles}`}>
                        {currentStyle.icon}
                      </span>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed pr-1">
                        {item.message}
                      </p>
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{getRelativeTime(item.createdAt)}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CREATE / EDIT TASK MODAL OVERLAY */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="mb-6 flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {editingTask ? 'Modify Task Sprint' : 'Add New Task Sprint'}
              </h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-5">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement middleware routes"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  disabled={taskSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-semibold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description Details
                </label>
                <textarea
                  placeholder="Detail the target goals of this sprint task..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows="3"
                  disabled={taskSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-medium resize-none"
                />
              </div>

              {/* Grid status & priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Task Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    disabled={taskSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  >
                    <option value="todo">Todo 📋</option>
                    <option value="in-progress">In Progress 🚀</option>
                    <option value="completed">Completed ✅</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Task Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    disabled={taskSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  >
                    <option value="low">Low Priority 🟢</option>
                    <option value="medium">Medium Priority 🟡</option>
                    <option value="high">High Priority 🔴</option>
                  </select>
                </div>

              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold">
                  Task Due Date *
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                  disabled={taskSubmitting}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex space-x-3.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  disabled={taskSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={taskSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {taskSubmitting ? <span>Saving...</span> : <span>Save Task</span>}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL OVERLAY */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600 font-black text-sm mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight text-center">
                Delete Task Confirmation
              </h3>
              <p className="text-slate-400 dark:text-slate-400 text-xs text-center mt-2 px-2 leading-relaxed">
                Are you absolutely sure you want to delete <strong className="text-slate-800 dark:text-white">"{taskToDelete?.title}"</strong>? This action is permanent.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button 
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50"
              >
                {deleteSubmitting ? "Deleting..." : "Delete Permanently"}
              </button>
              <button 
                onClick={() => { setShowDeleteModal(false); setTaskToDelete(null); }}
                disabled={deleteSubmitting}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-black dark:text-black py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Premium Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 max-w-sm w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm mb-4 shadow-md shadow-blue-500/20">
                P
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight text-center">
                Log out of your Project-<span className="text-blue-600">Sync</span> account
              </h3>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
              {userProfile?.profilepic && !imgError ? (
                <img 
                  src={userProfile.profilepic} 
                  alt={userName} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {getInitials(userName)}
                </div>
              )}
              <div className="overflow-hidden text-left">
                <div className="font-bold text-slate-800 text-[14px] truncate">{userName}</div>
                <div className="text-[11px] text-slate-400 font-semibold truncate">{userProfile?.email || 'Developer Member'}</div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button 
                onClick={() => { setShowLogoutModal(false); handleLogout(); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Log out
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-black py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const NavItem = ({ label, active, onClick, icon }) => (
  <div
    onClick={() => onClick(label)}
    className={`flex items-center space-x-3 cursor-pointer px-4.5 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition duration-150 select-none ${
      active 
        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20" 
        : "text-slate-600 dark:text-slate-400"
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span>{label}</span>
  </div>
);

export default ProjectDetails;
