import React, { useState, useEffect, useContext, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import LoginContext from '../../Context/LoginContext/CreateLoginContext';
import { getTaskDueStatus } from '../utils/dueStatusHelper';
import { showToast } from '../utils/toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  Clock, 
  CheckCircle2,
  AlertCircle,
  User,
  Layers,
  ChevronDown
} from 'lucide-react';
import GlobalCreateModal from '../components/GlobalCreateModal/GlobalCreateModal';

// Simple JWT decoder helper
const decodeToken = (jwtToken) => {
  if (!jwtToken) return null;
  try {
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token decoding failed inside Calendar:", e);
    return null;
  }
};

const CalendarFeature = () => {
  const { token, User: userName } = useContext(LoginContext);
  
  // Projects & Selected project
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Tasks list
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calendar Date State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filters State
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState('');

  // 1. Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Fetch Tasks whenever Selected Project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [selectedProjectId]);

  // 3. Listen to Refresh events (sent by navbar "+ Create" or other panels)
  useEffect(() => {
    const handleRefresh = () => {
      fetchTasks();
    };
    window.addEventListener('refresh-tasks', handleRefresh);
    return () => {
      window.removeEventListener('refresh-tasks', handleRefresh);
    };
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/api/projects');
      const list = response.data.projects || [];
      
      // Decode user token to get current user ID
      const decoded = decodeToken(token);
      const userId = decoded?.id;
      
      // Filter projects owned by current user
      const userProjects = list.filter(p => p.owner === userId);
      
      setProjects(userProjects);
      if (userProjects.length > 0) {
        setSelectedProjectId(userProjects[0]._id);
      }
    } catch (error) {
      console.error("Error fetching projects for Calendar:", error);
    }
  };

  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/tasks/project/${selectedProjectId}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error loading calendar tasks:", error);
      showToast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Retrieve normalized due date object to avoid timezone shifting
  const getTaskDueDateObj = (dueDateStr) => {
    if (!dueDateStr) return null;
    try {
      const parts = dueDateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(dueDateStr);
    } catch (e) {
      return new Date(dueDateStr);
    }
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Filter Tasks based on dropdown selectors
  const filteredTasks = tasks.filter(task => {
    // 1. Status Filter
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;

    // 2. Priority Filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // 3. Assigned to Me Filter
    if (assignedToMeOnly) {
      const decoded = decodeToken(token);
      const currentUserId = decoded?.id;
      const assigneeId = task.assignee?._id || task.assignee;
      if (assigneeId !== currentUserId) return false;
    }

    return true;
  });

  // Calendar Grid construction (Month view)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];

  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }

  // Next month padding to fill a 6-week grid (42 days)
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Task click (Opens Task Edit Modal)
  const handleTaskClick = (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setPrefilledDate('');
    setIsModalOpen(true);
  };

  // Day cell click (Opens Task Creation Modal with prefilled date)
  const handleCellClick = (cellDate) => {
    setSelectedTask(null);
    // Format cellDate to local YYYY-MM-DD
    const y = cellDate.getFullYear();
    const m = String(cellDate.getMonth() + 1).padStart(2, '0');
    const d = String(cellDate.getDate()).padStart(2, '0');
    setPrefilledDate(`${y}-${m}-${d}`);
    setIsModalOpen(true);
  };

  // Success handler for task changes
  const handleModalSuccess = () => {
    fetchTasks();
    // Dispatch a global event to keep Kanban Board/Issue Tracker in perfect sync
    window.dispatchEvent(new Event('refresh-tasks'));
  };

  // Due Status styling generators
  const getTaskStatusStyles = (task) => {
    const status = getTaskDueStatus(task);
    switch (status) {
      case 'overdue':
        return {
          bg: 'bg-rose-50/70 dark:bg-rose-950/20',
          border: 'border-l-rose-500 border-l-4 border-slate-200 dark:border-slate-800',
          text: 'text-rose-700 dark:text-rose-350',
          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-250/20'
        };
      case 'due-soon':
        return {
          bg: 'bg-amber-50/70 dark:bg-amber-950/20',
          border: 'border-l-amber-500 border-l-4 border-slate-200 dark:border-slate-800',
          text: 'text-amber-700 dark:text-amber-350',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450 border border-amber-250/20'
        };
      case 'completed':
        return {
          bg: 'bg-emerald-50/30 dark:bg-emerald-955/5',
          border: 'border-l-emerald-500 border-l-4 border-slate-200 dark:border-slate-800',
          text: 'text-emerald-700/80 dark:text-emerald-350/80 line-through opacity-75',
          badge: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450'
        };
      default: // upcoming
        return {
          bg: 'bg-blue-50/30 dark:bg-blue-955/5',
          border: 'border-l-blue-500 border-l-4 border-slate-200 dark:border-slate-800',
          text: 'text-blue-700 dark:text-blue-350',
          badge: 'bg-blue-100/80 text-blue-700 dark:bg-blue-950/30 dark:text-blue-450'
        };
    }
  };

  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  // Month Display Name
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Check if calendar has any scheduled tasks
  const hasScheduledTasks = tasks.some(t => t.dueDate);

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans select-none">
      
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-2">
        {/* Left Side: Month navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm shrink-0">
            <button 
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-350 cursor-pointer"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white shrink-0 min-w-[140px]">
            {monthName} {year}
          </h2>
        </div>

        {/* Right Side: Filters & Controls */}
        <div className="grid grid-cols-2 md:flex md:items-center md:flex-row gap-2.5">
          {/* Project dropdown */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 pr-10 rounded-xl text-xs font-bold focus:outline-none transition cursor-pointer shadow-sm text-slate-700 dark:text-slate-300"
            >
              {projects.length === 0 ? (
                <option value="">No Active Projects</option>
              ) : (
                projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-32 appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 pr-10 rounded-xl text-xs font-bold focus:outline-none transition cursor-pointer shadow-sm text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Priority dropdown */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full md:w-32 appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 pr-10 rounded-xl text-xs font-bold focus:outline-none transition cursor-pointer shadow-sm text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Assigned to Me Filter */}
          <button
            onClick={() => setAssignedToMeOnly(!assignedToMeOnly)}
            className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer ${
              assignedToMeOnly 
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Assigned to me</span>
          </button>
        </div>
      </div>

      {/* 2. CALENDAR BOARD GRID / LIST VIEWS */}
      {loading ? (
        /* Shimmer loading skeleton grid */
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {Array.from({ length: 42 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 h-28 p-3 animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-5/6 pt-2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty project onboarding state */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 shadow-inner">
          <Layers className="w-16 h-16 text-slate-300 dark:text-slate-750 mb-6" />
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No active projects found</h3>
          <p className="text-slate-450 dark:text-slate-400 text-xs mt-2 max-w-sm font-semibold leading-relaxed">
            Please register your first project workspace in the onboarding dashboard to start visual calendar task scheduling.
          </p>
        </div>
      ) : !hasScheduledTasks ? (
        /* Professional calendar empty scheduled tasks state */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 shadow-inner">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-450 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No scheduled tasks yet</h3>
          <p className="text-slate-450 dark:text-slate-400 text-xs mt-2 max-w-sm font-semibold leading-relaxed">
            There are no tasks with due dates in this project. Add due dates to tasks to see them plotted cleanly on your calendar.
          </p>
          <button
            onClick={() => handleCellClick(new Date())}
            className="mt-6 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create task</span>
          </button>
        </div>
      ) : (
        /* Month Calendar Layout */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm">
          
          {/* Day of the week column headers */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="bg-slate-50 dark:bg-slate-900/90 py-2.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
                {d}
              </div>
            ))}
          </div>

          {/* Month grid squares */}
          <div className="grid grid-cols-7 gap-px">
            {cells.map((cell, idx) => {
              const dayTasks = filteredTasks.filter(task => {
                const taskDate = getTaskDueDateObj(task.dueDate);
                return isSameDay(taskDate, cell.date);
              });

              const isToday = isSameDay(cell.date, new Date());

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(cell.date)}
                  className={`min-h-[110px] xl:min-h-[130px] p-2 flex flex-col justify-between transition group cursor-pointer relative ${
                    cell.isCurrentMonth
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/50'
                      : 'bg-slate-50/40 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600'
                  } ${isToday ? 'ring-2 ring-inset ring-blue-500 dark:ring-blue-500 bg-blue-50/5 dark:bg-blue-955/5 z-10' : ''}`}
                >
                  {/* Date indicator */}
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[11px] font-extrabold w-5.5 h-5.5 rounded-full flex items-center justify-center ${
                      isToday 
                        ? 'bg-blue-600 text-white font-black shadow-sm' 
                        : cell.isCurrentMonth
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-655'
                    }`}>
                      {cell.date.getDate()}
                    </span>

                    {/* Faint hover create task icon */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-350 dark:text-slate-600 hover:text-blue-500 p-0.5">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 overflow-y-auto max-h-[85px] xl:max-h-[95px] space-y-1 pr-0.5 custom-scrollbar">
                    {dayTasks.map(task => {
                      const styles = getTaskStatusStyles(task);
                      return (
                        <div
                          key={task._id}
                          onClick={(e) => handleTaskClick(e, task)}
                          className={`p-1.5 rounded-lg text-[10.5px] font-bold leading-tight shadow-sm select-none border transition cursor-pointer ${styles.bg} ${styles.border} ${styles.text} hover:scale-[1.01] hover:shadow-md`}
                          title={`${task.title} - Priority: ${task.priority || 'medium'}`}
                        >
                          <div className="flex items-center space-x-1.5 overflow-hidden">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getPriorityDotColor(task.priority)}`} />
                            <span className="truncate flex-1">{task.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. TASK CREATE / EDIT MODAL MOUNT */}
      <GlobalCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setPrefilledDate('');
        }}
        onSuccess={handleModalSuccess}
        initialProjectId={selectedProjectId}
        taskToEdit={selectedTask}
        initialDueDate={prefilledDate}
      />

    </div>
  );
};

export default CalendarFeature;
