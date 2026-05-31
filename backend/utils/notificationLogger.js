import NotificationModel from "../Models/NotificationModel.js";

/**
 * Modern backend notification service with strict duplicate prevention
 */
export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  entityType,
  entityId = null,
  link = "",
  metadata = {}
}) => {
  try {
    if (!recipient) return null;

    // Check duplicate for same recipient + type + entityType + entityId
    if (entityId) {
      const existing = await NotificationModel.findOne({
        recipient,
        type,
        entityType,
        entityId
      });
      if (existing) {
        return existing; // Prevent duplicate warning notifications
      }
    }

    const notification = await NotificationModel.create({
      recipient,
      sender,
      type,
      title,
      message,
      entityType,
      entityId,
      link,
      metadata
    });

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
    return null;
  }
};

/**
 * Backward compatibility wrapper for old logNotification calls
 */
export const logNotification = async ({ type, title, message, userId, projectId, taskId }) => {
  // Map old types to the new standardized uppercase type enums
  let newType = "GENERAL";
  let entityType = "general";
  let entityId = null;

  if (type === "task_completed" || type === "TASK_COMPLETED") {
    newType = "TASK_COMPLETED";
    entityType = "task";
    entityId = taskId;
  } else if (type === "due_soon" || type === "TASK_DUE_SOON") {
    newType = "TASK_DUE_SOON";
    entityType = "task";
    entityId = taskId;
  } else if (type === "overdue" || type === "TASK_OVERDUE") {
    newType = "TASK_OVERDUE";
    entityType = "task";
    entityId = taskId;
  } else if (type === "task_created" || type === "task_moved" || type === "task_deleted") {
    newType = "GENERAL";
    entityType = "task";
    entityId = taskId;
  } else if (projectId) {
    newType = "GENERAL";
    entityType = "project";
    entityId = projectId;
  }

  const link = entityId ? `/project/${projectId || ""}` : "";

  return await createNotification({
    recipient: userId,
    sender: null,
    type: newType,
    title,
    message,
    entityType,
    entityId,
    link
  });
};
