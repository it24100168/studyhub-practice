import React from 'react';
import { Button } from '../../components/ui/Button';
import { Subject } from './types';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subject: Subject | null;
}

export const DeleteSubjectModal: React.FC<DeleteSubjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subject,
}) => {
  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-surface-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-surface-900">Delete Subject</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-surface-600">
            Are you sure you want to delete <span className="font-semibold text-surface-900">{subject.code} - {subject.name}</span>?
          </p>
          <p className="text-xs text-surface-500 bg-surface-50 p-3 rounded-lg border border-surface-200">
            This action cannot be undone. All subject assignments, schedule tags, and resources associated with this subject may be affected.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-surface-50/50 border-t border-surface-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Subject
          </Button>
        </div>
      </div>
    </div>
  );
};
