import NotificationModel from "../Models/NotificationModel.js";

// GET ALL NOTIFICATIONS FOR LOGGED IN USER
// GET /api/notifications
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ notifications });
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

    const notification = await NotificationModel.findOne({ _id: id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
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
    await NotificationModel.updateMany(
      { user: req.user._id, isRead: false },
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

    const result = await NotificationModel.deleteOne({ _id: id, user: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found or access denied." });
    }

    return res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ message: "Server error while deleting notification." });
  }
};
