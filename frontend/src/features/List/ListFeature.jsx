import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast.js';
import { 
  Plus, 
  Layers, 
  Trash2, 
  Calendar, 
  Sparkles,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import GlobalCreateModal from '../../components/GlobalCreateModal/GlobalCreateModal';

const ListFeature = () => {
  const { User } = useContext(LoginContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal Trigger States
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Tasks when project selection changes
  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [selectedProject]);

  // Synchronize with global creation events
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
      console.error("Error loading projects in Issue Tracker:", error);
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/tasks/project/${selectedProject}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error loading project tasks in Issue Tracker:", error);
      showToast.error("Failed to load project tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      showToast.success("Task deleted successfully.");
      fetchTasks(); // Reload spreadsheet
      window.dispatchEvent(new CustomEvent('refresh-tasks'));
    } catch (error) {
      console.error("Task deletion error:", error);
      showToast.error("Failed to delete the task.");
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-250 dark:bg-rose-950 dark:text-rose-350 dark:border-rose-900">🔴 High</span>;
      case 'medium': 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-250 dark:bg-amber-955 dark:text-amber-350 dark:border-amber-900">🟡 Medium</span>;
      default: 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-emerald-105 text-emerald-800 border border-emerald-250 dark:bg-emerald-950 dark:text-emerald-350 dark:border-emerald-900">🟢 Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-350">Completed ✅</span>;
      case 'in-progress': 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300">In Progress 🚀</span>;
      default: 
        return <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300">Todo 📋</span>;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      
      {/* Workspace Selection & Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b-2 border-slate-100 dark:border-slate-800 pb-5 select-none">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 text-white shrink-0 shadow-md shadow-blue-500/10">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">📋 Workspace Issue Tracker</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Real-time table spreadsheet mapping project tasks</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-250">Select Project:</span>
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

          <button
            onClick={() => setShowCreateModal(true)}
            disabled={projects.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {loading ? (
        /* Table loading state skeleton */
        <div className="space-y-3.5 animate-pulse select-none">
          <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl"></div>
        </div>
      ) : projects.length === 0 ? (
        /* Empty State (No projects) */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl py-16 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border-2 border-blue-100/50 dark:border-blue-900/30 shadow-sm">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Register a project workspace</h3>
          <p className="text-slate-655 dark:text-slate-355 text-sm mt-2 max-w-sm leading-relaxed font-medium">
            Please register a new project workspace using the "+ Create" button at the top navbar first to begin tracking sprint backlogs.
          </p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty Tasks State */
        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-16 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">Empty Backlog Backbones</h3>
          <p className="text-slate-650 dark:text-slate-350 text-xs sm:text-sm mt-1.5 max-w-xs leading-relaxed font-medium">There are no sprint backlogs logged in this project. Click the button below to register the first task.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log First Task</span>
          </button>
        </div>
      ) : (
        /* Database Task Spreadsheet Table */
        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm select-none">
          <table className="min-w-full text-xs text-left text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-black tracking-wider border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4 text-left">Task Title</th>
                <th className="px-5 py-4 text-left">Description</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Priority</th>
                <th className="px-5 py-4 text-left">Due Date</th>
                <th className="px-5 py-4 text-left">Assignee</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition">
                  {/* Title */}
                  <td className="px-5 py-4 font-black text-slate-900 dark:text-white max-w-[200px] truncate">
                    {task.title}
                  </td>
                  
                  {/* Description */}
                  <td className="px-5 py-4 text-slate-650 dark:text-slate-350 max-w-[250px] truncate font-medium">
                    {task.description || <span className="italic text-slate-400 dark:text-slate-500">No details provided.</span>}
                  </td>
                  
                  {/* Status */}
                  <td className="px-5 py-4 shrink-0">
                    {getStatusBadge(task.status)}
                  </td>
                  
                  {/* Priority */}
                  <td className="px-5 py-4 shrink-0">
                    {getPriorityBadge(task.priority)}
                  </td>
                  
                  {/* Due Date */}
                  <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-200 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </td>
                  
                  {/* Assignee */}
                  <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                    {task.assignee ? (
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-800 shadow-sm">
                          {getInitials(task.assignee.name)}
                        </div>
                        <span className="truncate max-w-[100px] font-bold">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="italic text-slate-400 dark:text-slate-500 font-medium">Unassigned</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unified creation modal */}
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

export default ListFeature;
