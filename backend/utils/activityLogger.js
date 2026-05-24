import ActivityModel from "../Models/ActivityModel.js";

/**
 * Helper to log workspace activities automatically.
 * @param {Object} params
 * @param {string} params.type - Activity type (enum)
 * @param {string} params.message - Descriptive logging message
 * @param {string} params.projectId - Associated project ID
 * @param {string} [params.taskId] - Optional associated task ID
 * @param {string} params.ownerId - Associated user owner ID
 * @param {Object} [params.metadata] - Optional additional logging metadata
 */
export const logActivity = async ({ type, message, projectId, taskId, ownerId, metadata }) => {
  try {
    const activity = await ActivityModel.create({
      type,
      message,
      project: projectId,
      task: taskId,
      owner: ownerId,
      metadata
    });
    return activity;
  } catch (error) {
    console.error("Activity Logging Error:", error);
    // Silent fail so main task CRUD mutations are not blocked by logging issues
    return null;
  }
};
