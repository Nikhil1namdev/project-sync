import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "task_completed",
      "task_created",
      "task_deleted",
      "task_moved",
      "due_soon",
      "overdue",
      "project_created",
      "project_updated"
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }
}, {
  timestamps: true
});

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;
