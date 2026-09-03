import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AssignmentItem, AssignmentFormData, AssignmentFormErrors, AssignmentPriority, AssignmentStatus } from './types';
import { X, FileText, Calendar, Hash, Tag, AlertCircle } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AssignmentItem, 'id'>) => void;
  initialData?: AssignmentItem | null;
  mode: 'add' | 'edit';
}

const TYPE_OPTIONS = [
  'Written Report',
  'Project Draft',
  'Problem Set',
  'Coding Lab',
  'Peer Review',
  'Essay',
  'Quiz / Exam',
  'Presentation',
];

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    subjectCode: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    type: 'Written Report',
    description: '',
  });

  const [errors, setErrors] = useState<AssignmentFormErrors>({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title,
        subjectCode: initialData.subjectCode,
        dueDate: initialData.dueDate,
        status: initialData.status,
        priority: initialData.priority,
        type: initialData.type,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        subjectCode: '',
        dueDate: '',
        status: 'pending',
        priority: 'medium',
        type: 'Written Report',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: AssignmentFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }

    if (!formData.subjectCode.trim()) {
      newErrors.subjectCode = 'Subject code is required (e.g. CS 301)';
    }

    if (!formData.dueDate.trim()) {
      newErrors.dueDate = 'Due date is required (e.g. Sep 15, 2026 or YYYY-MM-DD)';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Assignment type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      subjectCode: formData.subjectCode.trim().toUpperCase(),
      dueDate: formData.dueDate.trim(),
      status: formData.status,
      priority: formData.priority,
      type: formData.type.trim(),
      description: formData.description?.trim(),
    });
    onClose();
  };

  const handleChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AssignmentFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl border border-surface-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 bg-surface-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900">
                {mode === 'add' ? 'Add New Assignment' : 'Edit Assignment'}
              </h2>
              <p className="text-xs text-surface-500">
                {mode === 'add' ? 'Track upcoming coursework and deadlines' : 'Update assignment details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Assignment Title *"
            placeholder="e.g. Algorithms Complexity Analysis Report"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
            leftIcon={<FileText className="w-4 h-4" />}
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject Code *"
              placeholder="e.g. CS 301"
              value={formData.subjectCode}
              onChange={(e) => handleChange('subjectCode', e.target.value)}
              error={errors.subjectCode}
              leftIcon={<Hash className="w-4 h-4" />}
            />

            <Input
              label="Due Date *"
              type="text"
              placeholder="e.g. Sep 18, 2026"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              error={errors.dueDate}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
                Assignment Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="block w-full rounded-lg border border-surface-300 bg-white text-surface-900 text-sm py-2 px-3 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
                Priority
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {(['low', 'medium', 'high'] as AssignmentPriority[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => handleChange('priority', p)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors ${
                      formData.priority === p
                        ? p === 'high'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                          : p === 'medium'
                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                          : 'bg-surface-100 border-surface-300 text-surface-800 shadow-xs'
                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
              Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(
                [
                  { value: 'pending', label: 'Pending' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'overdue', label: 'Overdue' },
                ] as { value: AssignmentStatus; label: string }[]
              ).map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => handleChange('status', s.value)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    formData.status === s.value
                      ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-xs'
                      : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === 'add' ? 'Add Assignment' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
