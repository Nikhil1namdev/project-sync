import React, { useEffect, useState, useCallback } from 'react';
import CreateNotificationContext from './CreateNotificationContext.js';

const STORAGE_KEY = 'project_sync_notifications';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Task Assigned',
    description: 'You have been assigned to the task "Implement Auth Flow Redesign" by Nikhil Namdev.',
    type: 'assignment',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Task Completed',
    description: 'Sarah Jenkins completed the task "Design Database Schema" under Project-Sync.',
    type: 'completion',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Due Soon Reminder',
    description: 'The task "Submit Project Roadmap & Architecture Specs" is due in 3 hours!',
    type: 'due_soon',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Project Created',
    description: 'A new workspace project "Atlassian UI Refactoring" has been successfully initialized.',
    type: 'project_created',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  }
];

/**
 * NotificationProvider — Atlassian-style client-side notification state.
 * Implements persistent LocalStorage store, live derived unread tracking,
 * and standard state mutators (markRead, markAllRead, add, delete, clear).
 */
export const NotificationProvider = ({ children }) => {
  // Safe localStorage state initialization
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing notifications from localStorage:', e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Keep localStorage synchronised with component state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error writing notifications to localStorage:', e);
    }
  }, [notifications]);

  // Mark a single notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Add a new notification (useful for programmatic testing or simulated triggers)
  const addNotification = useCallback((title, description, type) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Delete/dismiss a notification
  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications completely
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Derived state: number of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <CreateNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </CreateNotificationContext.Provider>
  );
};

export default NotificationProvider;
