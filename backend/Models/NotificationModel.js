import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  type: {
    type: String,
    enum: [
      "TASK_ASSIGNED",
      "TASK_DUE_SOON",
      "TASK_OVERDUE",
      "TASK_COMPLETED",
      "PROJECT_INVITATION",
      "GENERAL"
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
  entityType: {
    type: String,
    enum: [
      "task",
      "project",
      "comment",
      "general"
    ],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  link: {
    type: String,
    default: ""
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Configure composite performance indexes as required
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, entityType: 1, entityId: 1 });

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;
