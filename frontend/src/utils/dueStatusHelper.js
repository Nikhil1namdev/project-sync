/**
 * getTaskDueStatus — Core due date status evaluator.
 *
 * Rules:
 * 1. If task status is completed, return "completed"
 * 2. If task has no dueDate, return "no-due-date"
 * 3. If dueDate is before today and task is not completed, return "overdue"
 * 4. If dueDate is today or within next 2 days and task is not completed, return "due-soon"
 * 5. Otherwise return "upcoming"
 *
 * Normalizes input dates strictly by calendar day to avoid timezone bugs.
 */
export const getTaskDueStatus = (task) => {
  if (!task) return "no-due-date";
  if (task.status === "completed") return "completed";
  if (!task.dueDate) return "no-due-date";

  // Get current local date normalized to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse dueDate day/month/year components to avoid timezone shifting
  let dueDateObj;
  if (typeof task.dueDate === 'string') {
    const parts = task.dueDate.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed month
      const day = parseInt(parts[2], 10);
      dueDateObj = new Date(year, month, day);
    } else {
      dueDateObj = new Date(task.dueDate);
    }
  } else {
    dueDateObj = new Date(task.dueDate);
  }

  dueDateObj.setHours(0, 0, 0, 0);

  // Calculate day difference
  const diffTime = dueDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "overdue";
  } else if (diffDays <= 2) {
    return "due-soon";
  } else {
    return "upcoming";
  }
};
