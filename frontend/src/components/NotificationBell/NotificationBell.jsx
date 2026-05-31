import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash, Plus, AlertCircle, Calendar, X, FolderKanban, CheckSquare, Edit, UserCheck, MessageSquare } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { showToast } from '../../utils/toast';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await apiClient.get('/api/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Lightweight non-blocking polling every 20 seconds to feel live without WebSockets
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    // Optimistic update: instantly toggle status on the client for zero latency
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    try {
      await apiClient.patch(`/api/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark read:", error);
      fetchNotifications(true); // Revert on failure
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await apiClient.patch('/api/notifications/read-all');
      showToast.success("All notifications marked as read!");
    } catch (error) {
      console.error("Failed to mark all read:", error);
      fetchNotifications(true); // Revert on failure
    }
  };

  const handleDelete = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      await apiClient.delete(`/api/notifications/${id}`);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      fetchNotifications(true); // Revert on failure
    }
  };

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      await handleMarkAsRead(item._id);
    }
    if (item.link) {
      navigate(item.link);
      setIsOpen(false);
    }
  };

  // Human-readable relative time conversion
  const getRelativeTime = (dateString) => {
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
    return `${diffDay}d ago`;
  };

  // Get icons and Tailwind styles dynamically mapping to notification type
  const getTypeConfig = (type) => {
    const typeUpper = (type || '').toUpperCase();
    switch (typeUpper) {
      case 'TASK_ASSIGNED':
        return {
          icon: <UserCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
          bgColor: 'bg-blue-500/10 border-blue-500/20 dark:bg-blue-950/20 dark:border-blue-900/30'
        };
      case 'TASK_COMPLETED':
        return {
          icon: <CheckSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
          bgColor: 'bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-900/30'
        };
      case 'TASK_DUE_SOON':
        return {
          icon: <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />,
          bgColor: 'bg-amber-500/10 border-amber-500/20 dark:bg-amber-955/20 dark:border-amber-900/30'
        };
      case 'TASK_OVERDUE':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 animate-bounce" />,
          bgColor: 'bg-red-500/15 border-red-500/30 dark:bg-red-955/20 dark:border-red-900/40'
        };
      case 'PROJECT_INVITATION':
        return {
          icon: <FolderKanban className="w-4 h-4 text-violet-500 dark:text-violet-400" />,
          bgColor: 'bg-violet-500/10 border-violet-500/20 dark:bg-violet-955/20 dark:border-violet-900/30'
        };
      case 'GENERAL':
      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
          bgColor: 'bg-slate-500/10 border-slate-500/20 dark:bg-slate-900/20 dark:border-slate-800/30'
        };
    }
  };

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-650 dark:text-slate-350 transition duration-200 cursor-pointer focus:outline-none flex items-center justify-center bg-white dark:bg-slate-900"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-blue-600 dark:text-blue-400 animate-pulse' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel with Glassmorphism styles */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[500px] overflow-hidden bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-850 shadow-2xl rounded-2xl z-[100] flex flex-col animate-in fade-in slide-in-from-top-3 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-tight text-slate-800 dark:text-white">Workspace Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer focus:outline-none bg-transparent border-0"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 max-h-[360px] scrollbar-thin">
            {notifications.length === 0 ? (
              /* Premium Empty State */
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center select-none">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-slate-350 dark:text-slate-650" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">No notifications yet</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[220px]">
                  New updates from projects and tasks will appear here in real time.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const config = getTypeConfig(item.type);
                return (
                  <div
                    key={item._id}
                    className={`flex items-start gap-3 p-4 transition-all duration-150 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${!item.isRead ? 'bg-blue-50/10 dark:bg-blue-950/10' : ''}`}
                  >
                    {/* Color Coded Icon Container */}
                    <div 
                      onClick={() => handleNotificationClick(item)}
                      className={`p-2 rounded-xl border ${config.bgColor} shrink-0 cursor-pointer hover:scale-105 transition-transform`}
                    >
                      {config.icon}
                    </div>

                    {/* Content area */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          onClick={() => handleNotificationClick(item)}
                          className={`text-xs font-bold leading-none cursor-pointer hover:text-blue-600 transition-colors ${!item.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-450'}`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                          {getRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      
                      <p 
                        onClick={() => handleNotificationClick(item)}
                        className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed break-words text-left cursor-pointer"
                      >
                        {item.message}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-3.5 mt-2.5">
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item._id)}
                            className="flex items-center space-x-1 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer focus:outline-none bg-transparent border-0"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark read</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center space-x-1 text-[10px] font-extrabold text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 cursor-pointer focus:outline-none bg-transparent border-0"
                        >
                          <Trash className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
