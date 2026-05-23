import mongoose from "mongoose";

const ProjectTemplate = new mongoose.Schema({
  TemplateName: {
    type: String,
    enum: ["Jira", "Kanban", "Dev"],
    required: true
  }
});

const ProjectTemplateModel = mongoose.model("ProjectTemplateModel", ProjectTemplate);
export default ProjectTemplateModel;
