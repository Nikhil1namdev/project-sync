import React, { useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Clock, UserPlus, FolderPlus, X, PlusCircle, CheckSquare } from 'lucide-react';
import CreateNotificationContext from '../../../Context/NotificationContext/CreateNotificationContext.js';

/**
 * NotificationDropdown — Premium Atlassian-style Notification dropdown.
 * Placed in the Navbar next to user avatar/icons.
 * Supported features:
 * - Rich styling for assignments, completions, due dates, project creations.
 * - Interactive action items (Mark individual read, mark all read, delete/dismiss, clear all).
 * - Custom developer notification simulator to easily create live notification events on the client!
 */
const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    clearAll,
  } = useContext(CreateNotificationContext);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Only close if we didn't click the nav bell trigger itself (handled by nav)
        if (!e.target.closest('#nav-bell-btn')) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  // Relative time format helper
  const formatTime = (isoString) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 1000 / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  // Predefined lists of random notifications to trigger via the simulator button
  const triggerSampleSimulator = () => {
    const titles = [
      { t: 'Task Assigned', d: 'You were assigned to "Refactor Frontend Context API" in Project-Sync.', y: 'assignment' },
      { t: 'Task Completed', d: 'Nikhil completed task "Fix Logout color styling" in Project-Sync.', y: 'completion' },
      { t: 'Due Soon Reminder', d: 'Task "Submit final Atlassian presentation slides" is due in 1 hour!', y: 'due_soon' },
      { t: 'Project Created', d: 'New Project workspace "Atlassian Enterprise Collaboration" was created.', y: 'project_created' }
    ];
    const rand = titles[Math.floor(Math.random() * titles.length)];
    addNotification(rand.t, rand.d, rand.y);
  };

  // Stylized helper to get icon and colored background for notification types
  const getTypeStyling = (type) => {
    switch (type) {
      case 'assignment':
        return {
          icon: <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/30'
        };
      case 'completion':
        return {
          icon: <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-100 dark:ring-emerald-900/30'
        };
      case 'due_soon':
        return {
          icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-100 dark:ring-amber-900/30'
        };
      case 'project_created':
        return {
          icon: <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-100 dark:ring-indigo-900/30'
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-500" />,
          bg: 'bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-[340px] md:w-[380px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-[9999] overflow-hidden"
          style={{ transformOrigin: 'top right' }}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-2">
              <h3 className="text-[13.5px] font-black text-slate-800 dark:text-white tracking-wide">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[9.5px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11.5px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
            {notifications.length === 0 ? (
              /* Empty state */
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-slate-350 dark:text-slate-500 animate-pulse" />
                </div>
                <p className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                  You have no new alerts. Program new events below.
                </p>
              </div>
            ) : (
              /* Notifications present */
              notifications.map((item) => {
                const styling = getTypeStyling(item.type);
                return (
                  <div
                    key={item.id}
                    className={`relative p-4 flex gap-3 transition-all group ${
                      item.read
                        ? 'bg-transparent'
                        : 'bg-blue-50/20 dark:bg-blue-950/5 border-l-2 border-blue-500'
                    }`}
                  >
                    {/* Circle badge */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styling.bg}`}>
                        {styling.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[12px] font-black leading-tight ${item.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-850 dark:text-white'}`}>
                          {item.title}
                        </span>
                        <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 mt-1 select-all break-words">
                        {item.description}
                      </p>
                    </div>

                    {/* Action buttons (Appear on hover) */}
                    <div className="absolute right-3 top-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white dark:bg-slate-900 pl-2 shadow-l dark:shadow-none">
                      {!item.read && (
                        <button
                          onClick={() => markAsRead(item.id)}
                          title="Mark as read"
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(item.id)}
                        title="Dismiss"
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Controls & Simulator */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20 flex items-center justify-between gap-2">
            <button
              onClick={triggerSampleSimulator}
              className="flex-1 py-1.5 rounded-lg border border-dashed border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-[10.5px] font-bold hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Add sample mock notification to test state"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Simulate Alert
            </button>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
