import ActivityModel from "../Models/ActivityModel.js";
import ProjectModel from "../Models/ProjectModel.js";

// GET ACTIVITIES BY PROJECT
// GET /api/activity/project/:projectId
export const getActivitiesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user owns it
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You do not own this project." });
    }

    // Retrieve activities sorted by most recent
    const activities = await ActivityModel.find({ project: projectId, owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ activities });
  } catch (error) {
    console.error("Get Activities By Project error:", error);
    return res.status(500).json({ message: "Server error while retrieving activities." });
  }
};

// GET RECENT ACTIVITIES ACROSS ALL PROJECTS OWNED BY USER
// GET /api/activity/recent
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({ activities });
  } catch (error) {
    console.error("Get Recent Activities error:", error);
    return res.status(500).json({ message: "Server error while retrieving recent activities." });
  }
};
