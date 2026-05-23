import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  status: {
    type: String,
    enum: ["planning", "in-progress", "completed"],
    default: "planning"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;
