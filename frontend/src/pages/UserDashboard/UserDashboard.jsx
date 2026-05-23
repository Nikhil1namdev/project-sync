import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  ArrowRight
} from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast';

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Project Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = Create, object = Edit
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStatus, setProjectStatus] = useState('planning');
  const [projectPriority, setProjectPriority] = useState('medium');
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectDueDate, setProjectDueDate] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Delete Confirmation States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const isPremium = true; 
  const navigate = useNavigate();

  // Context triggers
  const { setLogin, setUser, setToken } = useContext(LoginContext);

  // Load authenticated user profile details from localStorage
  const userProfile = (() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        return JSON.parse(info);
      } catch (e) {
        console.error("Error loading user profile details inside UserDashboard:", e);
      }
    }
    return null;
  })();

  const userName = userProfile?.name || 'User';
  const token = userProfile?.token;

  // Helper utility to compute initials fallback
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper utility to format MongoDB ISO date string nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // FETCH PROJECTS FROM BACKEND
  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Fetch Projects Error:", error);
      showToast.error("Failed to retrieve your projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      navigate('/Login');
    }
  }, [token]);

  const handleNavClick = (label) => {
    setActiveItem(label);
    if (label === "Pricing") {
      navigate('/PricingPage');
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
    showToast.success("Logged out successfully. See you soon!");
    navigate('/Login', { replace: true });
  };

  // OPEN MODAL FOR NEW PROJECT
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setProjectTitle('');
    setProjectDesc('');
    setProjectStatus('planning');
    setProjectPriority('medium');
    setProjectStartDate(new Date().toISOString().split('T')[0]);
    setProjectDueDate('');
    setShowProjectModal(true);
  };

  // OPEN MODAL FOR EDITING PROJECT
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDesc(project.description || '');
    setProjectStatus(project.status || 'planning');
    setProjectPriority(project.priority || 'medium');
    setProjectStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setProjectDueDate(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '');
    setShowProjectModal(true);
  };

  // SUBMIT PROJECT (CREATE OR UPDATE)
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDueDate) {
      showToast.error("Title and Due Date are required.");
      return;
    }

    setModalSubmitting(true);
    try {
      const payload = {
        title: projectTitle,
        description: projectDesc,
        status: projectStatus,
        priority: projectPriority,
        startDate: projectStartDate,
        dueDate: projectDueDate
      };

      if (editingProject) {
        // PATCH update request
        await axios.patch(`http://localhost:8000/api/projects/${editingProject._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast.success("Project updated successfully!");
      } else {
        // POST create request
        await axios.post('http://localhost:8000/api/projects', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast.success("Project created successfully!");
      }

      setShowProjectModal(false);
      fetchProjects(); // Reload list
    } catch (error) {
      console.error("Project submission error:", error);
      const msg = error.response?.data?.message || "Failed to save project details.";
      showToast.error(msg);
    } finally {
      setModalSubmitting(false);
    }
  };

  // TRIGGER DELETE MODAL
  const handleTriggerDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // CONFIRM ACTION DELETE PROJECT
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleteSubmitting(true);
    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast.success("Project successfully deleted.");
      setShowDeleteModal(false);
      fetchProjects(); // Reload list
    } catch (error) {
      console.error("Delete Project Error:", error);
      showToast.error("Failed to delete project.");
    } finally {
      setDeleteSubmitting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between select-none border-r border-slate-200/60 dark:border-slate-800 relative">
        <div>
          {/* Project-Sync Branding */}
          <div className="flex items-center space-x-2.5 px-6 py-5 border-b border-slate-100 dark:border-slate-800 pb-4 mb-8">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/10">
              P
            </div>
            <span className="text-[15px] font-bold text-slate-800 dark:text-white tracking-tight">
              Project-<span className="text-blue-600">Sync</span>
            </span>
          </div>

          <nav className="space-y-1.5 px-4">
            <NavItem label="Dashboard" active={activeItem === "Dashboard"} onClick={handleNavClick} icon={<Layers className="w-4 h-4" />} />
            <NavItem label="Workspace Sprints" active={false} onClick={handleJiraClick} icon={<FolderKanban className="w-4 h-4" />} />
            <NavItem label="Pricing Plan" active={activeItem === "Pricing"} onClick={() => handleNavClick("Pricing")} icon={<Briefcase className="w-4 h-4" />} />
          </nav>
        </div>

        {/* Dynamic User Profile Indicator with Premium Dropdown Trigger */}
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
                className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-8 sm:p-12">
        
        {/* Dynamic Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/60 dark:border-slate-800 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Workspace Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Manage, track, and modify your active project sprints.</p>
          </div>
          
          <div className="flex items-center space-x-3.5">
            <button
              onClick={handleJiraClick}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* PROJECTS SECTION */}
        {loading ? (
          /* Premium Shimmer Loading Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6"></div>
                <div className="h-px bg-slate-100 dark:bg-slate-800 pt-2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
                  <div className="flex space-x-2">
                    <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Illustration Empty State Card */
          <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl py-20 max-w-xl mx-auto shadow-sm select-none">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No projects found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm">
              Your workspace is currently clean. Click the blue button on the top-right to register your first project!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-6 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition cursor-pointer"
            >
              Start tracking projects
            </button>
          </div>
        ) : (
          /* Responsive Cards Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              // Format priority and status badges
              const statusColors = {
                planning: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
                "in-progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
                completed: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
              };

              const priorityColors = {
                low: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
                medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30"
              };

              return (
                <div 
                  key={project._id} 
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/55 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base leading-snug line-clamp-1">
                        {project.title}
                      </h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.75 rounded-full border shrink-0 ${statusColors[project.status || 'planning']}`}>
                        {project.status || 'planning'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed h-8">
                      {project.description ? project.description : <span className="italic text-slate-300 dark:text-slate-600">No description provided.</span>}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex items-center space-x-2.5 mb-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${priorityColors[project.priority || 'medium']}`}>
                        {project.priority || 'medium'} Priority
                      </span>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-4 mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-550">
                      
                      {/* Due date */}
                      <div className="flex items-center space-x-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: {formatDate(project.dueDate)}</span>
                      </div>

                      {/* Edit/Delete Actions */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-555 hover:text-blue-600 dark:text-slate-400 transition cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTriggerDelete(project); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-555 hover:text-red-600 dark:text-slate-400 transition cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* CREATE / EDIT PROJECT MODAL OVERLAY */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="mb-6 flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {editingProject ? 'Modify Project Sprints' : 'Start a New Project'}
              </h3>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-5">
              
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Website Redesign"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  disabled={modalSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-semibold"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Summarize the core target milestones of this project..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows="3"
                  disabled={modalSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-sm font-medium resize-none"
                />
              </div>

              {/* Grid: Status & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    disabled={modalSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  >
                    <option value="planning">Planning 📋</option>
                    <option value="in-progress">In Progress 🚀</option>
                    <option value="completed">Completed ✅</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    value={projectPriority}
                    onChange={(e) => setProjectPriority(e.target.value)}
                    disabled={modalSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  >
                    <option value="low">Low Priority 🟢</option>
                    <option value="medium">Medium Priority 🟡</option>
                    <option value="high">High Priority 🔴</option>
                  </select>
                </div>

              </div>

              {/* Grid: Dates */}
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
                    disabled={modalSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold font-extrabold">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={projectDueDate}
                    onChange={(e) => setProjectDueDate(e.target.value)}
                    required
                    disabled={modalSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-semibold cursor-pointer"
                  />
                </div>

              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex space-x-3.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  disabled={modalSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {modalSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save Project</span>
                  )}
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
            
            {/* Branding Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600 font-black text-sm mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight text-center">
                Delete Project Confirmation
              </h3>
              <p className="text-slate-400 dark:text-slate-400 text-xs text-center mt-2 px-2 leading-relaxed">
                Are you absolutely sure you want to delete <strong className="text-slate-800 dark:text-white">"{projectToDelete?.title}"</strong>? This action is permanent.
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
                onClick={() => { setShowDeleteModal(false); setProjectToDelete(null); }}
                disabled={deleteSubmitting}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-black dark:text-black py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Premium Atlassian-Style Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 max-w-sm w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200">
            {/* Branding Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm mb-4 shadow-md shadow-blue-500/20">
                P
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight text-center">
                Log out of your Project-<span className="text-blue-600">Sync</span> account
              </h3>
            </div>

            {/* User Details Account Card */}
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

            {/* Confirmation Actions */}
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

            {/* Footnote */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">
                One account for all your synchronized workspaces.
              </div>
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

export default UserDashboard;
