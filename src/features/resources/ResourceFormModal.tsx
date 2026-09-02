import React, { useState, useEffect } from 'react';
import { ResourceItem, ResourceFormData, FormErrors, ResourceType } from './types';
import { RESOURCE_TYPES } from './resourceData';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X, Globe, BookOpen, Layers, Link as LinkIcon, FileText } from 'lucide-react';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResourceFormData) => void;
  initialData?: ResourceItem | null;
}

export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const DEFAULT_FORM: ResourceFormData = {
  title: '',
  subject: '',
  type: 'Lecture Note',
  link: '',
  description: '',
};

const POPULAR_SUBJECTS = [
  'CS 301 - Data Structures',
  'CS 340 - Database Management',
  'MATH 220 - Linear Algebra',
  'ENG 205 - Technical Writing',
  'SE 402 - Software Architecture',
  'AI 310 - Artificial Intelligence',
];

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<ResourceFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subject: initialData.subject,
        type: initialData.type,
        link: initialData.link,
        description: initialData.description || '',
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (values: ResourceFormData): FormErrors => {
    const errs: FormErrors = {};
    if (!values.title.trim()) {
      errs.title = 'Resource title is required.';
    } else if (values.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }

    if (!values.subject.trim()) {
      errs.subject = 'Subject is required.';
    }

    if (!values.type) {
      errs.type = 'Please select a resource type.';
    }

    if (!values.link.trim()) {
      errs.link = 'Resource URL is required.';
    } else if (!isValidUrl(values.link.trim())) {
      errs.link = 'Please enter a valid URL (e.g., https://example.com/notes.pdf).';
    }

    return errs;
  };

  const handleChange = (
    field: keyof ResourceFormData,
    value: string
  ) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const errs = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: errs[field],
      }));
    }
  };

  const handleBlur = (field: keyof ResourceFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: errs[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      subject: true,
      type: true,
      link: true,
      description: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        link: formData.link.trim(),
        description: formData.description.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 bg-surface-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900">
                {initialData ? 'Edit Study Resource' : 'Add New Study Resource'}
              </h2>
              <p className="text-xs text-surface-500">
                {initialData
                  ? 'Update information, URLs, or notes for this resource.'
                  : 'Add a new lecture note, reference link, book, or video.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-700 p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Resource Title */}
          <div>
            <Input
              label="Resource Title *"
              placeholder="e.g. Graph Algorithms & Dijkstra's Algorithm Notes"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={touched.title ? errors.title : undefined}
              leftIcon={<FileText className="w-4 h-4" />}
            />
          </div>

          {/* Subject Field & Presets */}
          <div className="space-y-1.5">
            <Input
              label="Subject / Course *"
              placeholder="e.g. CS 301 - Data Structures"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
              error={touched.subject ? errors.subject : undefined}
              leftIcon={<Layers className="w-4 h-4" />}
            />
            {/* Quick subject pickers */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-surface-400 font-medium">Quick suggestions:</span>
              {POPULAR_SUBJECTS.slice(0, 3).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleChange('subject', sub)}
                  className="text-[11px] px-2 py-0.5 rounded bg-surface-100 hover:bg-brand-50 hover:text-brand-700 text-surface-600 transition-colors border border-surface-200"
                >
                  {sub.split(' - ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Type Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
              Resource Type *
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as ResourceType)}
                onBlur={() => handleBlur('type')}
                className={`block w-full rounded-lg border text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 py-2 px-3 appearance-none bg-white text-surface-900 ${
                  touched.type && errors.type
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                    : 'border-surface-300 focus:border-brand-500 focus:ring-brand-100'
                }`}
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {touched.type && errors.type && (
              <p className="text-xs text-red-600 font-medium">{errors.type}</p>
            )}
          </div>

          {/* Resource URL / Link */}
          <div>
            <Input
              label="Resource Link / URL *"
              placeholder="https://example.com/study-material"
              type="url"
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              onBlur={() => handleBlur('link')}
              error={touched.link ? errors.link : undefined}
              helperText="Must be a valid web link starting with http:// or https://"
              leftIcon={<LinkIcon className="w-4 h-4" />}
              rightIcon={<Globe className="w-4 h-4" />}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary or study notes about this resource..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="block w-full rounded-lg border border-surface-300 bg-white text-surface-900 text-sm p-3 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 placeholder-surface-400"
            />
          </div>

          {/* Modal Actions Footer */}
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
              {initialData ? 'Save Changes' : 'Add Resource'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
