import React, { useState } from 'react';
import { Plus, Search, CheckSquare, ListTodo, Inbox } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTaskStore } from './useTaskStore';
import { TaskFormModal } from './TaskFormModal';
import { TaskCard } from './TaskCard';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Task, TaskFormData, FilterType } from './types';

export const TasksPage: React.FC = () => {
  const {
    filteredTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    pendingCount,
    completedCount,
  } = useTaskStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // ── Handlers ──────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleDeleteRequest = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingTask(null);
  };

  // ── Filter button helper ───────────────────────────────────
  const filterButtons: { label: string; value: FilterType; count?: number }[] = [
    { label: 'All Tasks', value: 'all', count: pendingCount + completedCount },
    { label: 'Pending', value: 'pending', count: pendingCount },
    { label: 'Completed', value: 'completed', count: completedCount },
  ];

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Study Tasks"
        description="Organise daily study goals, break down work into bite-sized tasks, and track your progress."
        badge={
          pendingCount > 0 ? (
            <Badge variant="warning" withDot>
              {pendingCount} Pending
            </Badge>
          ) : (
            <Badge variant="success" withDot>
              All Done 🎉
            </Badge>
          )
        }
        actions={
          <Button
            id="tasks-add-btn"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            Add Study Task
          </Button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            id="tasks-search"
            placeholder="Search task title or subject…"
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {filterButtons.map(({ label, value, count }) => {
            const isActive = filter === value;
            return (
              <Button
                key={value}
                id={`tasks-filter-${value}`}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(value)}
              >
                {label}
                {count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Task List Card */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {filter === 'all'
                ? 'All Study Tasks'
                : filter === 'pending'
                ? 'Pending Tasks'
                : 'Completed Tasks'}
            </CardTitle>
            <CardDescription>
              {filteredTasks.length === 0
                ? 'No tasks match your current filter.'
                : 'Hover over a task to edit or delete it. Click the checkbox to toggle completion.'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500 font-medium shrink-0">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              <span className="font-bold text-surface-800">{completedCount}</span>{' '}
              of{' '}
              <span className="font-bold text-surface-800">
                {pendingCount + completedCount}
              </span>{' '}
              done
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-surface-100">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRequest}
              />
            ))
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              {filter === 'completed' ? (
                <>
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <CheckSquare className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-surface-700">No completed tasks yet</p>
                  <p className="text-xs text-surface-400 mt-1 max-w-xs">
                    Complete a task by clicking its checkbox to see it here.
                  </p>
                </>
              ) : filter === 'pending' ? (
                <>
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                    <ListTodo className="w-7 h-7 text-brand-400" />
                  </div>
                  <p className="text-sm font-medium text-surface-700">
                    {searchQuery ? 'No tasks match your search' : 'No pending tasks!'}
                  </p>
                  <p className="text-xs text-surface-400 mt-1 max-w-xs">
                    {searchQuery
                      ? 'Try a different search term.'
                      : "You're all caught up. Great work! 🎉"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
                    <Inbox className="w-7 h-7 text-surface-400" />
                  </div>
                  <p className="text-sm font-medium text-surface-700">
                    {searchQuery ? 'No tasks match your search' : 'No study tasks yet'}
                  </p>
                  <p className="text-xs text-surface-400 mt-1 max-w-xs">
                    {searchQuery
                      ? 'Try a different search term.'
                      : 'Click "Add Study Task" to create your first task.'}
                  </p>
                  {!searchQuery && (
                    <Button
                      id="tasks-empty-add-btn"
                      variant="primary"
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      className="mt-4"
                      onClick={handleOpenAdd}
                    >
                      Add Study Task
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
