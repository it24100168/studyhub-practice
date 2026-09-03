import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Subject, SubjectFormData, SubjectFormErrors } from './types';
import { X, BookOpen, User, Calendar, Award, Hash, Palette } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Subject, 'id'>) => void;
  initialData?: Subject | null;
  mode: 'add' | 'edit';
}

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Cyan', value: 'bg-cyan-500' },
];

const SEMESTER_SUGGESTIONS = [
  'Fall 2026',
  'Spring 2026',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Summer 2026',
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<SubjectFormData>({
    code: '',
    name: '',
    lecturer: '',
    semester: '',
    credits: '',
    color: 'bg-blue-500',
  });

  const [errors, setErrors] = useState<SubjectFormErrors>({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        lecturer: initialData.lecturer,
        semester: initialData.semester,
        credits: initialData.credits,
        color: initialData.color || 'bg-blue-500',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        lecturer: '',
        semester: '',
        credits: '',
        color: 'bg-blue-500',
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: SubjectFormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Subject code is required (e.g. CS 301)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }

    if (!formData.lecturer.trim()) {
      newErrors.lecturer = 'Lecturer name is required';
    }

    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required (e.g. Fall 2026, Semester 1)';
    }

    const creditNum = Number(formData.credits);
    if (!formData.credits || isNaN(creditNum) || creditNum <= 0 || creditNum > 30) {
      newErrors.credits = 'Credits must be a valid number between 1 and 30';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      lecturer: formData.lecturer.trim(),
      semester: formData.semester.trim(),
      credits: Number(formData.credits),
      color: formData.color || 'bg-blue-500',
    });
    onClose();
  };

  const handleChange = (field: keyof SubjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof SubjectFormErrors]) {
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
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900">
                {mode === 'add' ? 'Add New Subject' : 'Edit Subject'}
              </h2>
              <p className="text-xs text-surface-500">
                {mode === 'add' ? 'Enter subject details and academic credits' : 'Update details for this subject'}
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject Code *"
              placeholder="e.g. CS 301"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              error={errors.code}
              leftIcon={<Hash className="w-4 h-4" />}
              autoFocus
            />

            <Input
              label="Credits *"
              type="number"
              min="1"
              max="30"
              placeholder="e.g. 4"
              value={formData.credits}
              onChange={(e) => handleChange('credits', e.target.value)}
              error={errors.credits}
              leftIcon={<Award className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Subject Name *"
            placeholder="e.g. Data Structures & Algorithms"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            leftIcon={<BookOpen className="w-4 h-4" />}
          />

          <Input
            label="Lecturer Name *"
            placeholder="e.g. Dr. Evelyn Vance"
            value={formData.lecturer}
            onChange={(e) => handleChange('lecturer', e.target.value)}
            error={errors.lecturer}
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="space-y-1.5">
            <Input
              label="Semester *"
              placeholder="e.g. Fall 2026 or Semester 1"
              value={formData.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
              error={errors.semester}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
            {/* Quick semester chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-surface-400">Quick select:</span>
              {SEMESTER_SUGGESTIONS.slice(0, 4).map((sem) => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => handleChange('semester', sem)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    formData.semester === sem
                      ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                      : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Color tag selector */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-surface-400" />
              Color Accent
            </label>
            <div className="flex items-center gap-2.5 pt-0.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => handleChange('color', c.value)}
                  className={`w-6 h-6 rounded-full ${c.value} transition-transform ${
                    formData.color === c.value
                      ? 'ring-2 ring-offset-2 ring-brand-500 scale-110 shadow-sm'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {mode === 'add' ? 'Add Subject' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
