import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Plus,
  Search,
  BookOpen,
  Filter,
  Layers,
  FileText,
  Video,
  Globe,
  Folder,
  X,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { ResourceItem, ResourceType, ResourceFormData } from './types';
import { RESOURCE_TYPES, getStoredResources, saveStoredResources } from './resourceData';
import { ResourceCard } from './ResourceCard';
import { ResourceFormModal } from './ResourceFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(() => getStoredResources());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [deletingResource, setDeletingResource] = useState<ResourceItem | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    saveStoredResources(resources);
  }, [resources]);

  // Unique subjects for filter
  const subjectsList = useMemo(() => {
    const subjects = new Set<string>();
    resources.forEach((r) => {
      if (r.subject) subjects.add(r.subject);
    });
    return Array.from(subjects).sort();
  }, [resources]);

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: resources.length };
    RESOURCE_TYPES.forEach((t) => {
      counts[t] = 0;
    });
    resources.forEach((r) => {
      if (counts[r.type] !== undefined) {
        counts[r.type]++;
      } else {
        counts[r.type] = 1;
      }
    });
    return counts;
  }, [resources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // Type filter
      if (selectedType !== 'All' && resource.type !== selectedType) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== 'All' && resource.subject !== selectedSubject) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesSubject = resource.subject.toLowerCase().includes(query);
        const matchesDesc = (resource.description || '').toLowerCase().includes(query);
        const matchesLink = resource.link.toLowerCase().includes(query);
        return matchesTitle || matchesSubject || matchesDesc || matchesLink;
      }

      return true;
    });
  }, [resources, selectedType, selectedSubject, searchQuery]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingResource(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (resource: ResourceItem) => {
    setEditingResource(resource);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingResource(null);
  };

  const handleSaveResource = (formData: ResourceFormData) => {
    if (editingResource) {
      // Update existing
      setResources((prev) =>
        prev.map((item) =>
          item.id === editingResource.id
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );
      showToast(`Resource "${formData.title}" updated successfully.`);
    } else {
      // Add new
      const newResource: ResourceItem = {
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setResources((prev) => [newResource, ...prev]);
      showToast(`New resource "${formData.title}" added successfully.`);
    }
    handleCloseFormModal();
  };

  const handleDeletePrompt = (resource: ResourceItem) => {
    setDeletingResource(resource);
  };

  const handleConfirmDelete = () => {
    if (deletingResource) {
      setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
      showToast(`Resource "${deletingResource.title}" deleted.`);
      setDeletingResource(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedSubject('All');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-surface-900 text-white rounded-xl shadow-xl border border-surface-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-surface-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Study Resources"
        description="Organize lecture notes, online video tutorials, recommended books, documentation, and web references."
        badge={
          <Badge variant="purple" withDot>
            {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
          >
            Add Resource
          </Button>
        }
      />

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-xl border border-surface-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Lecture Notes</p>
            <p className="text-base font-bold text-surface-900">{typeCounts['Lecture Note'] || 0}</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-surface-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Videos</p>
            <p className="text-base font-bold text-surface-900">{typeCounts['Video'] || 0}</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-surface-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Websites</p>
            <p className="text-base font-bold text-surface-900">{typeCounts['Website'] || 0}</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-surface-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Books</p>
            <p className="text-base font-bold text-surface-900">{typeCounts['Book'] || 0}</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-surface-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Other</p>
            <p className="text-base font-bold text-surface-900">{typeCounts['Other'] || 0}</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search by title, subject, link, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-surface-700 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Subject Select Filter */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="relative w-full">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-surface-300 bg-white text-surface-700 py-2.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
              >
                <option value="All">All Subjects</option>
                {subjectsList.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-surface-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 border-t border-surface-100">
          <span className="text-xs font-semibold text-surface-500 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-surface-400" />
            Types:
          </span>

          <button
            type="button"
            onClick={() => setSelectedType('All')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 ${
              selectedType === 'All'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
            }`}
          >
            All Types
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedType === 'All' ? 'bg-brand-700 text-white' : 'bg-surface-200 text-surface-600'
              }`}
            >
              {typeCounts.All || 0}
            </span>
          </button>

          {RESOURCE_TYPES.map((type) => {
            const count = typeCounts[type] || 0;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                }`}
              >
                {type}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-brand-700 text-white' : 'bg-surface-200 text-surface-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Cards Grid or Empty State */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-surface-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 text-surface-400 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-surface-900">
              No study resources found
            </h3>
            <p className="text-xs text-surface-500 leading-relaxed">
              {searchQuery || selectedType !== 'All' || selectedSubject !== 'All'
                ? 'No resources match your active search and filter criteria. Try resetting filters or adjusting search terms.'
                : 'No resources have been added yet. Upload your first lecture note, video, or study website.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {searchQuery || selectedType !== 'All' || selectedSubject !== 'All' ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddModal}
            >
              Add New Resource
            </Button>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      <ResourceFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSaveResource}
        initialData={editingResource}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingResource}
        resource={deletingResource}
        onClose={() => setDeletingResource(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
