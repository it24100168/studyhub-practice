import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckSquare, Square } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Task } from './types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityBadge = (priority: Task['priority']) => {
  if (priority === 'high')
    return (
      <Badge variant="danger" size="sm" withDot>
        High
      </Badge>
    );
  if (priority === 'medium')
    return (
      <Badge variant="warning" size="sm" withDot>
        Medium
      </Badge>
    );
  return (
    <Badge variant="default" size="sm" withDot>
      Low
    </Badge>
  );
};

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (iso: string, status: Task['status']): boolean => {
  if (status === 'completed' || !iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) < today;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const done = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);
  const dateLabel = formatDate(task.dueDate);

  return (
    <div
      className={`p-4 flex items-start gap-4 transition-colors duration-150 group ${
        done ? 'bg-surface-50/60 opacity-80' : 'hover:bg-surface-50/50'
      }`}
    >
      {/* Checkbox toggle */}
      <button
        id={`task-toggle-${task.id}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={done ? 'Mark as pending' : 'Mark as completed'}
        className={`mt-0.5 shrink-0 transition-colors duration-150 ${
          done ? 'text-emerald-500' : 'text-surface-300 hover:text-brand-500'
        }`}
      >
        {done ? (
          <CheckSquare className="w-5 h-5" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            done ? 'line-through text-surface-400' : 'text-surface-900'
          }`}
        >
          {task.title}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-surface-500">
          <Badge variant="primary" size="sm">
            {task.subject}
          </Badge>

          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-surface-400" />
            <span className={overdue ? 'text-rose-600 font-semibold' : ''}>
              {overdue ? `Overdue · ${dateLabel}` : dateLabel}
            </span>
          </span>

          {task.description && (
            <span
              className="hidden sm:inline max-w-xs truncate text-surface-400"
              title={task.description}
            >
              · {task.description}
            </span>
          )}
        </div>
      </div>

      {/* Right side — priority + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:block">{priorityBadge(task.priority)}</div>

        {/* Status badge */}
        {done ? (
          <Badge variant="success" size="sm" withDot className="hidden sm:inline-flex">
            Done
          </Badge>
        ) : overdue ? (
          <Badge variant="danger" size="sm" withDot className="hidden sm:inline-flex">
            Overdue
          </Badge>
        ) : null}

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Button
            id={`task-edit-${task.id}`}
            variant="ghost"
            size="sm"
            icon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="!px-2"
          />
          <Button
            id={`task-delete-${task.id}`}
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            className="!px-2 hover:!bg-rose-50"
          />
        </div>
      </div>
    </div>
  );
};
