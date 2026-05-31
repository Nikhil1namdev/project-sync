import NotificationModel from "../Models/NotificationModel.js";
import TaskModel from "../Models/TaskModel.js";
import { createNotification } from "../utils/notificationLogger.js";

/**
 * Scans user-related tasks (owned or assigned) and creates TASK_OVERDUE/TASK_DUE_SOON notifications.
 * Relies on duplicate prevention in createNotification to remain 100% safe.
 */
export const generateDueDateNotificationsForUser = async (userId) => {
  try {
    const tasks = await TaskModel.find({
      $or: [{ owner: userId }, { assignee: userId }],
      status: { $ne: "completed" }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const dueDateObj = new Date(task.dueDate);
      dueDateObj.setHours(0, 0, 0, 0);

      if (dueDateObj < today) {
        // Task is overdue
        await createNotification({
          recipient: userId,
          sender: null,
          type: "TASK_OVERDUE",
          title: "Task Overdue Alert",
          message: `Task "${task.title}" is overdue! It was due on ${dueDateObj.toLocaleDateString()}.`,
          entityType: "task",
          entityId: task._id,
          link: `/project/${task.project}`
        });
      } else {
        const twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2);

        if (dueDateObj >= today && dueDateObj <= twoDaysLater) {
          // Task is due soon
          await createNotification({
            recipient: userId,
            sender: null,
            type: "TASK_DUE_SOON",
            title: "Task Due Soon Warning",
            message: `Task "${task.title}" is due soon! It is due on ${dueDateObj.toLocaleDateString()}.`,
            entityType: "task",
            entityId: task._id,
            link: `/project/${task.project}`
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating due date notifications:", error);
  }
};

// GET ALL NOTIFICATIONS FOR LOGGED IN USER (WITH PAGINATION AND UNREAD COUNT)
// GET /api/notifications
export const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Asynchronously scan and generate due date notifications before fetching
    await generateDueDateNotificationsForUser(req.user._id);

    // Fetch user-specific notifications sorted by newest first
    const notifications = await NotificationModel.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate unread count across all notifications for this recipient
    const unreadCount = await NotificationModel.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      page,
      limit
    });
  } catch (error) {
    console.error("Get User Notifications error:", error);
    return res.status(500).json({ message: "Server error while retrieving notifications." });
  }
};

// MARK SPECIFIC NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and verify recipient owns the notification
    const notification = await NotificationModel.findOne({ _id: id, recipient: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or access denied." });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Server error while marking read." });
  }
};

// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    // Update all unread notifications belonging to the logged-in recipient
    await NotificationModel.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "Server error while marking all read." });
  }
};

// DELETE SPECIFIC NOTIFICATION
// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete if recipient matches to prevent unauthorized deletion
    const result = await NotificationModel.deleteOne({ _id: id, recipient: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found or access denied." });
    }

    return res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ message: "Server error while deleting notification." });
  }
};
