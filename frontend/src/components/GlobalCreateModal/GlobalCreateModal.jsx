import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../utils/apiClient';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast';
import { Layers, Briefcase, Plus, Calendar, AlertCircle } from 'lucide-react';

const GlobalCreateModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialProjectId = '', 
  initialType = 'task', // 'task' or 'project'
  taskToEdit = null,
  projectToEdit = null,
  initialDueDate = ''
}) => {
  const { User } = useContext(LoginContext);
  const [activeTab, setActiveTab] = useState(initialType); // 'task' or 'project'
  
  // Projects list for Task Creation
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  // Task Form States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskProject, setTaskProject] = useState(initialProjectId);
  const [submittingTask, setSubmittingTask] = useState(false);

  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStatus, setProjectStatus] = useState('planning');
  const [projectPriority, setProjectPriority] = useState('medium');
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectDueDate, setProjectDueDate] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);

  // Fetch Projects and Users for dropdown lists
  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchUsers();
    }
  }, [isOpen]);

  // Synchronize initial prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialType);
      
      if (initialProjectId) {
        setTaskProject(initialProjectId);
      }
      
      if (taskToEdit) {
        setActiveTab('task');
        setTaskTitle(taskToEdit.title || '');
        setTaskDesc(taskToEdit.description || '');
        setTaskStatus(taskToEdit.status || 'todo');
        setTaskPriority(taskToEdit.priority || 'medium');
        setTaskDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setTaskAssignee(taskToEdit.assignee?._id || taskToEdit.assignee || '');
        setTaskProject(taskToEdit.project?._id || taskToEdit.project || initialProjectId);
      } else {
        setTaskTitle('');
        setTaskDesc('');
        setTaskStatus('todo');
        setTaskPriority('medium');
        setTaskDueDate(initialDueDate || new Date().toISOString().split('T')[0]);
        setTaskAssignee('');
      }

      if (projectToEdit) {
        setActiveTab('project');
        setProjectTitle(projectToEdit.title || '');
        setProjectDesc(projectToEdit.description || '');
        setProjectStatus(projectToEdit.status || 'planning');
        setProjectPriority(projectToEdit.priority || 'medium');
        setProjectStartDate(projectToEdit.startDate ? new Date(projectToEdit.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setProjectDueDate(projectToEdit.dueDate ? new Date(projectToEdit.dueDate).toISOString().split('T')[0] : '');
      } else {
        setProjectTitle('');
        setProjectDesc('');
        setProjectStatus('planning');
        setProjectPriority('medium');
        setProjectStartDate(new Date().toISOString().split('T')[0]);
        setProjectDueDate('');
      }
    }
  }, [isOpen, initialProjectId, initialType, taskToEdit, projectToEdit]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await apiClient.get('/api/projects');
      const list = response.data.projects || [];
      setProjects(list);
      // Pre-select first project if no project is active
      if (!taskProject && list.length > 0) {
        setTaskProject(list[0]._id);
      }
    } catch (error) {
      console.error("Error loading projects for Task Modal:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/auth/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching workspace users for dropdown select:", error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate || !taskProject) {
      showToast.error("Title, Due Date, and Target Project are required.");
      return;
    }

    setSubmittingTask(true);
    try {
      const payload = {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        projectId: taskProject,
        assignee: taskAssignee || null
      };

      if (taskToEdit) {
        await apiClient.patch(`/api/tasks/${taskToEdit._id}`, payload);
        showToast.success("Task updated successfully!");
      } else {
        await apiClient.post('/api/tasks', payload);
        showToast.success("Task created successfully!");
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Task creation failure:", error);
      const msg = error.response?.data?.message || "Failed to save sprint task.";
      showToast.error(msg);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDueDate) {
      showToast.error("Title and Due Date are required.");
      return;
    }

    setSubmittingProject(true);
    try {
      const payload = {
        title: projectTitle,
        description: projectDesc,
        status: projectStatus,
        priority: projectPriority,
        startDate: projectStartDate,
        dueDate: projectDueDate
      };

      if (projectToEdit) {
        await apiClient.patch(`/api/projects/${projectToEdit._id}`, payload);
        showToast.success("Project updated successfully!");
      } else {
        await apiClient.post('/api/projects', payload);
        showToast.success("Project created successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Project creation failure:", error);
      const msg = error.response?.data?.message || "Failed to save project parameters.";
      showToast.error(msg);
    } finally {
      setSubmittingProject(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Title and Close Trigger */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">
            {taskToEdit ? 'Modify Task Sprint' : projectToEdit ? 'Modify Project Milestone' : 'Create New Sprint Element'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Global tab selector if not editing an existing item */}
        {!taskToEdit && !projectToEdit && (
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('task')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition duration-150 flex items-center justify-center space-x-2 ${
                activeTab === 'task' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition duration-150 flex items-center justify-center space-x-2 ${
                activeTab === 'project' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        )}

        {/* TASK CREATION AND EDIT FORM */}
        {activeTab === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            
            {/* Target Project Dropdown Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Destination Project *
              </label>
              <select
                value={taskProject}
                onChange={(e) => setTaskProject(e.target.value)}
                disabled={submittingTask || !!initialProjectId || !!taskToEdit}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {loadingProjects ? (
                  <option>Loading active projects...</option>
                ) : projects.length === 0 ? (
                  <option value="">No projects available (Create a project first!)</option>
                ) : (
                  projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))
                )}
              </select>
            </div>

            {/* Task Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Task Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Design Login UI components"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                disabled={submittingTask}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-semibold"
              />
            </div>

            {/* Task Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Description Details
              </label>
              <textarea
                placeholder="Describe details, parameters, and sprint goals..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                rows="3"
                disabled={submittingTask}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-medium resize-none"
              />
            </div>

            {/* Status & Priority Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Task Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Task Status
                </label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  disabled={submittingTask}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Task Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Task Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  disabled={submittingTask}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold font-extrabold">
                  Task Due Date *
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                  disabled={submittingTask}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                />
              </div>

              {/* Assignee Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold">
                  Assignee
                </label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  disabled={submittingTask}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                >
                  <option value="">Unassigned 👤</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email.split('@')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex space-x-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submittingTask}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingTask || projects.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {submittingTask ? 'Saving Task...' : taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>

          </form>
        )}

        {/* PROJECT CREATION AND EDIT FORM */}
        {activeTab === 'project' && (
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            
            {/* Project Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Corporate Web Redesign"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
                disabled={submittingProject}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-semibold"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Description Summary
              </label>
              <textarea
                placeholder="Outline target sprints, goals, and delivery schedules..."
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows="3"
                disabled={submittingProject}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-medium resize-none"
              />
            </div>

            {/* Status & Priority Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project Status
                </label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  disabled={submittingProject}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project Priority
                </label>
                <select
                  value={projectPriority}
                  onChange={(e) => setProjectPriority(e.target.value)}
                  disabled={submittingProject}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* Start Date & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  disabled={submittingProject}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={projectDueDate}
                  onChange={(e) => setProjectDueDate(e.target.value)}
                  required
                  disabled={submittingProject}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex space-x-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submittingProject}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {submittingProject ? 'Saving Project...' : projectToEdit ? 'Save Changes' : 'Create Project'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default GlobalCreateModal;
