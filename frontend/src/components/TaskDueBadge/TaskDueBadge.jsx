import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { getTaskDueStatus } from '../../utils/dueStatusHelper';

/**
 * TaskDueBadge — Reusable UI badge showing task due alert status.
 *
 * Renderings:
 * - "overdue"   -> Red pulsing badge with AlertCircle icon
 * - "due-soon"  -> Amber/Orange badge with Clock icon
 * - "upcoming", "completed", "no-due-date" -> Renders nothing
 */
export const TaskDueBadge = ({ task }) => {
  const status = getTaskDueStatus(task);

  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-955/40 dark:text-rose-400 dark:border-rose-900/30 shadow-sm select-none animate-pulse">
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span>Overdue</span>
      </span>
    );
  }

  if (status === 'due-soon') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30 shadow-sm select-none">
        <Clock className="w-3 h-3 shrink-0" />
        <span>Due Soon</span>
      </span>
    );
  }

  return null;
};

export default TaskDueBadge;
