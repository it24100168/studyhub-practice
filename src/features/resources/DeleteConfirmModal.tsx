import React from 'react';
import { ResourceItem } from './types';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  resource: ResourceItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  resource,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 p-1 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-surface-900">
              Delete Resource
            </h3>
            <p className="mt-2 text-sm text-surface-600">
              Are you sure you want to delete <span className="font-semibold text-surface-900">"{resource.title}"</span>?
            </p>
            <div className="mt-3 p-3 bg-surface-50 rounded-lg border border-surface-200 text-xs text-surface-500 space-y-1">
              <div><strong className="text-surface-700">Subject:</strong> {resource.subject}</div>
              <div><strong className="text-surface-700">Type:</strong> {resource.type}</div>
            </div>
            <p className="mt-3 text-xs text-red-600">
              This action cannot be undone.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirm}>
              Delete Resource
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
