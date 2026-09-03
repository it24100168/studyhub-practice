import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Task } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-red-600" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-semibold text-surface-900"
              >
                Delete Task?
              </h2>
              <p
                id="delete-modal-desc"
                className="text-sm text-surface-500 mt-1 leading-relaxed"
              >
                Are you sure you want to delete{' '}
                <span className="font-medium text-surface-800">
                  &ldquo;{task.title}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 mt-6">
            <Button
              id="delete-modal-cancel"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              id="delete-modal-confirm"
              variant="danger"
              onClick={onConfirm}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
