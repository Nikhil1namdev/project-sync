import mongoose from "mongoose";

const CreatingProject = new mongoose.Schema({
  ProjectName: { type: String, required: true },
  ProjectDescription: { type: String },
  // template: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectTemplateModel", required: true },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "TableModel" }], 
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
}, { timestamps: true });

const CreatingProjectModel = mongoose.model("CreatingProject", CreatingProject);
export default CreatingProjectModel;
// Linked tasks
// Linked messages