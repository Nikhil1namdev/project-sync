import NotificationModel from "../Models/NotificationModel.js";

/**
 * Creates a notification with automatic spam prevention
 */
export const logNotification = async ({ type, title, message, userId, projectId, taskId }) => {
  try {
    if (!userId) return null;

    // 1. Prevent duplicate unread 'overdue' or 'due_soon' warnings for the same task
    if ((type === "overdue" || type === "due_soon") && taskId) {
      const existing = await NotificationModel.findOne({
        type,
        task: taskId,
        user: userId,
        isRead: false
      });
      if (existing) {
        return existing; // Skip creating duplicate unread warning
      }
    }

    // 2. Prevent spam of 'task_moved' status logs by updating the existing unread one in place
    if (type === "task_moved" && taskId) {
      const existing = await NotificationModel.findOne({
        type,
        task: taskId,
        user: userId,
        isRead: false
      });
      if (existing) {
        existing.title = title;
        existing.message = message;
        await existing.save();
        return existing;
      }
    }

    // 3. Create a fresh notification
    const notification = await NotificationModel.create({
      type,
      title,
      message,
      user: userId,
      project: projectId,
      task: taskId
    });

    return notification;
  } catch (err) {
    console.error("Failed to log notification:", err);
    return null;
  }
};
