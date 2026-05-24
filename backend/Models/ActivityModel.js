import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "project_created",
      "project_updated",
      "task_created",
      "task_updated",
      "task_deleted",
      "task_status_changed",
      "task_completed"
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const ActivityModel = mongoose.model("Activity", activitySchema);
export default ActivityModel;
