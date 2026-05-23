import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Star, 
  UserCheck, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  TrendingUp, 
  MessageCircle, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  User2, 
  ArrowRight,
  HelpCircle,
  LogOut,
  ChevronUp
} from 'lucide-react';
import ToDolist from '../../features/ToDolist';
import Jira from './Jira';
import ChatFeature from '../../features/ChatFeature/ChatFeature';
import Chat from '../../components/ChatComponents/Chat';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast';

export default function JiraDashboard() {
  const { User, setLogin, setUser, setToken } = useContext(LoginContext);
  const [activeTab, setActiveTab] = useState('Summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Secure Logout action clearing local state and route cache
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setLogin(false);
    setUser(null);
    setToken(null);
    showToast.success("Logged out successfully. See you soon!");
    navigate('/Login', { replace: true });
  };

  // Load authenticated user profile details from localStorage
  const userProfile = (() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        return JSON.parse(info);
      } catch (e) {
        console.error("Error loading user profile details inside JiraDashboard:", e);
      }
    }
    return null;
  })();

  const userName = userProfile?.name || User || 'User';

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Primary sidebar selections mapped to their respective content tabs
  const sidebarLinks = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'Summary' },
    { name: 'Projects', icon: Sparkles, tab: 'Summary' },
    { name: 'Board', icon: FolderKanban, tab: 'ToDo ' },
    { name: 'Tasks', icon: CheckSquare, tab: 'Create List/Forms' },
    { name: 'Assigned', icon: UserCheck, tab: 'Assigned to me' },
    { name: 'Chat', icon: MessageSquare, tab: 'Chat' },
    { name: 'Reports', icon: BarChart3, tab: 'Summary' },
    { name: 'Settings', icon: Settings, tab: 'Summary' }
  ];

  const tabs = ['Summary', 'ToDo ', 'Create List/Forms', 'Starred', 'Assigned to me', 'Chat', 'NewChat'];

  const stats = [
    { title: 'Open work items', count: 4, desc: 'Needs review', color: 'text-blue-600 bg-blue-50' },
    { title: 'Done work items', count: 12, desc: 'Verified in prod', color: 'text-green-600 bg-green-50' },
    { title: 'Team Chats', count: 28, desc: 'Socket pipeline live', color: 'text-purple-600 bg-purple-50' },
    { title: 'Active sprints', count: 1, desc: 'Sprint 3 active', color: 'text-amber-600 bg-amber-50' }
  ];

  const mockAssignedTasks = [
    { id: 'SYNC-10', title: 'Implement Framer Motion transition dynamics', priority: 'High', status: 'In Progress' },
    { id: 'SYNC-14', title: 'Polish responsive layout wrappers for mobile users', priority: 'Medium', status: 'Todo' },
    { id: 'SYNC-18', title: 'Refactor state persistence model across columns', priority: 'High', status: 'In Progress' },
    { id: 'SYNC-21', title: 'Write secure JWT middleware payload controllers', priority: 'Low', status: 'Completed' }
  ];

  const handleSidebarClick = (link) => {
    setActiveTab(link.tab);
    showToast.info(`Switched view to ${link.name}`);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 justify-between select-none">
        <div className="space-y-6">
          {/* Logo element */}
          <div className="flex items-center space-x-2.5 px-2 py-1.5 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-center w-6.5 h-6.5 rounded-md bg-blue-600 text-white font-black text-xs shadow-sm">
              P
            </div>
            <span className="text-[14px] font-bold text-slate-800 tracking-tight">
              Project-<span className="text-blue-600">Sync</span> Workspace
            </span>
          </div>

          {/* User profile identifier with Dropdown Trigger */}
          <div className="relative">
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 cursor-pointer select-none hover:bg-slate-100/50 transition duration-150"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                {userProfile?.profilepic && !imgError ? (
                  <img 
                    src={userProfile.profilepic} 
                    alt={userName} 
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer" // Bypass Google media server 403 blocks
                    onError={() => setImgError(true)} // Safely unmount on error
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200/30 shrink-0">
                    {getInitials(userName)}
                  </div>
                )}
                <div className="overflow-hidden text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active User</div>
                  <div className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{userName}</div>
                </div>
              </div>
              <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>

            {/* Premium Profile Actions Overlay */}
            {showProfileMenu && (
              <div className="absolute bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-2 z-50 select-none">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                  <div className="font-bold text-slate-800 text-[12px] truncate">{userName}</div>
                  <div className="text-[9px] text-slate-400 font-semibold truncate">{userProfile?.email || 'Developer Member'}</div>
                </div>
                <button 
                  onClick={() => { setShowProfileMenu(false); navigate('/UserDashboard'); }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.75 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-blue-50/50 hover:text-blue-600 transition text-left cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                  <span>User Dashboard</span>
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); navigate('/pricing'); }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.75 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-blue-50/50 hover:text-blue-600 transition text-left cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Account Settings</span>
                </button>
                
                <div className="h-px bg-slate-100 my-1.5" />
                
                <button 
                  onClick={() => { setShowProfileMenu(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.75 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Workspace</div>
            {sidebarLinks.map((link, idx) => {
              const IconComp = link.icon;
              const isActive = (link.tab === activeTab && link.name !== 'Reports' && link.name !== 'Settings');
              return (
                <button
                  key={idx}
                  onClick={() => handleSidebarClick(link)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold tracking-tight transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50/60 text-blue-600 border-l-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-semibold space-y-2">
          <div className="flex items-center space-x-2 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Real-time Sync Active</span>
          </div>
          <p className="px-2">© {new Date().getFullYear()} Project-Sync</p>
        </div>
      </aside>

      {/* 2. MAIN HUB CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header / Greeting Bar */}
        <header className="bg-white border-b border-slate-200/80 h-14 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-4">
            <h2 className="text-[14px] font-bold text-slate-800">
              Welcome back, <span className="text-blue-600">{User || 'Developer'}</span>
            </h2>
            <span className="w-px h-4 bg-slate-200"></span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/30">
              ⚡ Sprint Alpha Workspace
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search issues, chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition"
              />
            </div>
            
            <button 
              onClick={() => showToast.warning("Creating tasks via shortcut is available inside the Board/Spreadsheet tab!")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </header>

        {/* Main Tab Navigation & Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Workspace Navigation Tabs */}
          <div className="flex items-center space-x-1 border-b border-slate-200 shrink-0 select-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2.5 px-4 text-xs font-bold transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'ToDo ' ? '📋 Kanban Board' : tab === 'Create List/Forms' ? '📊 Issue Tracker' : tab === 'NewChat' ? '💬 Thread Chat' : tab}
                  {tab === 'Assigned to me' && (
                    <span className="ml-1.5 bg-blue-100 text-blue-600 text-[10px] rounded-full px-1.5 py-0.2 font-black">
                      4
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Displays (with AnimatePresence) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.16 }}
            >
              {activeTab === 'Summary' && (
                <div className="space-y-6">
                  
                  {/* Row 1: Workspace progress summary card */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-800">Sprint Alpha Pipeline</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Project-Sync Core Delivery</p>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          Active Sprint
                        </span>
                      </div>

                      {/* Progress meter */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Sprint completion progress</span>
                          <span className="text-blue-600">75% Complete</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full w-[75%]"></div>
                        </div>
                      </div>

                      {/* Info indicators */}
                      <div className="flex items-center space-x-6 text-xs pt-2">
                        <div>
                          <span className="text-slate-400 font-medium">Open tasks: </span>
                          <span className="font-extrabold text-slate-700">4 items</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
                        <div>
                          <span className="text-slate-400 font-medium">Done items: </span>
                          <span className="font-extrabold text-slate-700">12 items</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
                        <div>
                          <span className="text-slate-400 font-medium">Sprint velocity: </span>
                          <span className="font-extrabold text-purple-600">92%</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => setActiveTab('ToDo ')}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        >
                          Access Kanban Board
                        </button>
                        <button 
                          onClick={() => setActiveTab('Chat')}
                          className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        >
                          Open Team Chat
                        </button>
                      </div>
                    </div>

                    {/* Stats Widget grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</div>
                          <div className="mt-2.5">
                            <span className="text-2xl font-black text-slate-800">{stat.count}</span>
                            <span className="block text-[10px] font-bold text-slate-400 mt-0.5">{stat.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Recent Activity / Documentation Preview */}
                  <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2.5">🎯 Workspace Sprint Directives</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Dynamic WebSocket pipelines are active.</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-6">
                          Our socket channels are connected directly to state handlers. Any changes made inside the board tabs will update simultaneously.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-purple-600">
                          <Sparkles className="w-4 h-4" />
                          <span>Google SSO + JWT persistent verification is secure.</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-6">
                          Protected local JWT session token keys safely preserve current user structures when reloading browsers or navigating across tabs.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Kanban tab */}
              {activeTab === 'ToDo ' && (
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <ToDolist />
                </div>
              )}

              {/* Issue spreadsheet tracker tab */}
              {activeTab === 'Create List/Forms' && (
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <Jira />
                </div>
              )}

              {/* Empty Starred state */}
              {activeTab === 'Starred' && (
                <div className="bg-white border border-slate-200/80 p-12 rounded-2xl shadow-sm text-center max-w-xl mx-auto space-y-4 my-6">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-xl shadow-sm border border-amber-100/50">
                    ★
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-slate-800">No starred items yet</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      Star your most important tasks inside the spreadsheet tracker or Kanban board to catalog priority objectives right here.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Create List/Forms')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Open Issue Tracker
                  </button>
                </div>
              )}

              {/* Assigned to me list */}
              {activeTab === 'Assigned to me' && (
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-800">Tasks assigned to {User || 'me'}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      4 tasks total
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {mockAssignedTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:border-slate-300 transition duration-150"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                              {task.id}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{task.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${task.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {task.priority}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Socket Chat feature */}
              {activeTab === 'Chat' && (
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <ChatFeature />
                </div>
              )}

              {/* Thread Chat alternative */}
              {activeTab === 'NewChat' && (
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <Chat />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* 3. RIGHT INSIGHTS PANEL */}
      <aside className="hidden xl:flex flex-col w-80 bg-white border-l border-slate-200/80 p-5 shrink-0 select-none space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Project Insights</h4>
          
          {/* Project health card */}
          <div className="bg-blue-50/50 border border-blue-100/50 p-4.5 rounded-2xl space-y-3.5 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                PS
              </div>
              <div>
                <h5 className="text-[12px] font-extrabold text-slate-800">Project-Sync Health</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workspace Health Index</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Sprint Delivery Speed</span>
                <span className="text-blue-600">Excellent</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[90%]"></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Prioritize visual features inside your Kanban board, then seamlessly track progress metrics live across active user sessions.
            </p>
          </div>
        </div>

        {/* Sprint progress highlights */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collaboration Index</h4>
          
          <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center space-x-2.5 text-xs font-bold text-slate-700">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Real-time Chat Activity</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Real-time synchronization operates over direct websocket connection hooks. Launch sprint discussions inside the chat tab.
            </p>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center space-x-2.5 text-xs font-bold text-slate-700">
              <User2 className="w-4 h-4 text-emerald-600" />
              <span>User Session Management</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Google SSO integration is active. Accounts are successfully bound to verified developer workspace session contexts.
            </p>
          </div>
        </div>

        {/* Quick Help card */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-3.5 shadow-md mt-auto">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4.5 h-4.5 text-blue-400" />
            <h5 className="text-[12px] font-extrabold">Need Assistance?</h5>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Read our 13 technical architectural documentation guides inside your local `/docs` workspace folder.
          </p>
          <button 
            onClick={() => showToast.success("Documentation is stored locally in the '/docs' folder!")}
            className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
          >
            Review Dev Guides
          </button>
        </div>
      </aside>

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
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/10 shrink-0">
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
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
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
}
