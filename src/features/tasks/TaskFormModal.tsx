import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, AlignLeft, Tag, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Task, TaskFormData, TaskFormErrors, Priority, TaskStatus } from './types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editingTask?: Task | null;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  subject: '',
  dueDate: '',
  priority: 'medium',
  description: '',
  status: 'pending',
};

const validate = (data: TaskFormData, isEdit: boolean): TaskFormErrors => {
  const errors: TaskFormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Task title is required.';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required.';
  }

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isEdit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(data.dueDate);
    if (selected < today) {
      errors.dueDate = 'Due date cannot be in the past.';
    }
  }

  if (!data.priority) {
    errors.priority = 'Priority is required.';
  }

  return errors;
};

const selectClass =
  'block w-full rounded-lg border border-surface-300 bg-white text-surface-900 text-sm ' +
  'px-3.5 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-100 ' +
  'focus:border-brand-500 appearance-none cursor-pointer';

const textareaClass =
  'block w-full rounded-lg border border-surface-300 bg-white text-surface-900 text-sm ' +
  'px-3.5 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-100 ' +
  'focus:border-brand-500 resize-none';

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-surface-600 mb-1.5';

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
}) => {
  const isEdit = !!editingTask;
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setForm({
          title: editingTask.title,
          subject: editingTask.subject,
          dueDate: editingTask.dueDate,
          priority: editingTask.priority,
          description: editingTask.description,
          status: editingTask.status,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, editingTask]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // clear error on change
    if (errors[name as keyof TaskFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { title: true, subject: true, dueDate: true, priority: true };
    setTouched(allTouched);
    const validation = validate(form, isEdit);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <div>
            <h2
              id="task-modal-title"
              className="text-base font-semibold text-surface-900"
            >
              {isEdit ? 'Edit Study Task' : 'Add Study Task'}
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              {isEdit
                ? 'Update the details of your study task.'
                : 'Fill in the details to create a new study task.'}
            </p>
          </div>
          <button
            id="task-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form
          id="task-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {/* Task Title */}
          <Input
            id="task-title"
            name="title"
            label="Task Title"
            placeholder="e.g. Read Chapter 4 on Red-Black Trees"
            value={form.title}
            onChange={handleChange}
            error={touched.title ? errors.title : undefined}
            leftIcon={<Tag className="w-4 h-4" />}
            autoFocus
          />

          {/* Subject */}
          <Input
            id="task-subject"
            name="subject"
            label="Subject"
            placeholder="e.g. CS 301, MATH 220"
            value={form.subject}
            onChange={handleChange}
            error={touched.subject ? errors.subject : undefined}
            leftIcon={<BookOpen className="w-4 h-4" />}
          />

          {/* Due Date + Priority — side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <Input
              id="task-due-date"
              name="dueDate"
              type="date"
              label="Due Date"
              value={form.dueDate}
              onChange={handleChange}
              error={touched.dueDate ? errors.dueDate : undefined}
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            {/* Priority */}
            <div className="w-full space-y-1.5">
              <label htmlFor="task-priority" className={labelClass}>
                Priority
              </label>
              <div className="relative rounded-lg shadow-sm">
                <select
                  id="task-priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={`${selectClass} pl-3.5 pr-9 ${
                    touched.priority && errors.priority
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : ''
                  }`}
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-surface-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {touched.priority && errors.priority && (
                <p className="text-xs text-red-600 font-medium">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Status — edit mode only */}
          {isEdit && (
            <div className="w-full space-y-1.5">
              <label htmlFor="task-status" className={labelClass}>
                Status
              </label>
              <div className="relative rounded-lg shadow-sm">
                <select
                  id="task-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`${selectClass} pl-3.5 pr-9`}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-surface-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="w-full space-y-1.5">
            <label htmlFor="task-description" className={labelClass}>
              Description{' '}
              <span className="normal-case font-normal text-surface-400">(optional)</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute top-2.5 left-3 text-surface-400 pointer-events-none">
                <AlignLeft className="w-4 h-4" />
              </div>
              <textarea
                id="task-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add any notes or details about this task…"
                rows={3}
                className={`${textareaClass} pl-9`}
              />
            </div>
          </div>

          {/* Validation summary — shows if any error present after submit attempt */}
          {Object.values(errors).some(Boolean) &&
            Object.values(touched).some(Boolean) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Please fix the highlighted errors before submitting.</span>
              </div>
            )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-surface-100 bg-surface-50/50">
          <Button
            id="task-modal-cancel"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="task-modal-submit"
            type="submit"
            form="task-form"
            variant="primary"
          >
            {isEdit ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </div>
    </div>
  );
};
