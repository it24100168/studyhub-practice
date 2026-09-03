import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Card, CardContent } from '../../components/ui/Card';
import { SubjectModal } from './SubjectModal';
import { DeleteSubjectModal } from './DeleteSubjectModal';
import { SubjectCard } from './SubjectCard';
import { Subject } from './types';
import {
  Plus,
  Search,
  BookOpen,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Award,
  Calendar,
  XCircle,
  GraduationCap,
} from 'lucide-react';

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: '1',
    code: 'CS 301',
    name: 'Data Structures & Algorithms',
    lecturer: 'Dr. Evelyn Vance',
    semester: 'Fall 2026',
    credits: 4,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    code: 'CS 340',
    name: 'Database Management Systems',
    lecturer: 'Prof. Marcus Chen',
    semester: 'Fall 2026',
    credits: 4,
    color: 'bg-purple-500',
  },
  {
    id: '3',
    code: 'MATH 220',
    name: 'Linear Algebra & Applications',
    lecturer: 'Dr. Sophia Reyes',
    semester: 'Fall 2026',
    credits: 3,
    color: 'bg-emerald-500',
  },
  {
    id: '4',
    code: 'ENG 205',
    name: 'Technical Writing & Communication',
    lecturer: 'Prof. David Miller',
    semester: 'Spring 2026',
    credits: 3,
    color: 'bg-amber-500',
  },
];

const STORAGE_KEY = 'studyhub_subjects';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse subjects from localStorage', e);
      }
    }
    return INITIAL_SUBJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  // Derived available semesters
  const availableSemesters = useMemo(() => {
    const sems = new Set<string>();
    subjects.forEach((s) => {
      if (s.semester) sems.add(s.semester);
    });
    return Array.from(sems);
  }, [subjects]);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.lecturer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSemester =
        selectedSemester === 'all' || subject.semester.toLowerCase() === selectedSemester.toLowerCase();

      return matchesSearch && matchesSemester;
    });
  }, [subjects, searchQuery, selectedSemester]);

  // Total credits calculation
  const totalCredits = useMemo(() => {
    return filteredSubjects.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0);
  }, [filteredSubjects]);

  // Handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subject: Subject) => {
    setModalMode('edit');
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSaveSubject = (data: Omit<Subject, 'id'>) => {
    if (modalMode === 'add') {
      const newSubject: Subject = {
        ...data,
        id: Date.now().toString(),
      };
      setSubjects((prev) => [newSubject, ...prev]);
    } else if (modalMode === 'edit' && editingSubject) {
      setSubjects((prev) =>
        prev.map((sub) => (sub.id === editingSubject.id ? { ...data, id: editingSubject.id } : sub))
      );
    }
  };

  const handleOpenDeleteModal = (subject: Subject) => {
    setDeletingSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSubject) {
      setSubjects((prev) => prev.filter((s) => s.id !== deletingSubject.id));
      setIsDeleteModalOpen(false);
      setDeletingSubject(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSemester('all');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Subjects & Courses"
        description="Manage your enrolled subjects, course details, faculty lecturers, semesters, and academic credit units."
        badge={
          <Badge variant="primary" withDot>
            {subjects.length} Total {subjects.length === 1 ? 'Subject' : 'Subjects'}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
          >
            Add New Subject
          </Button>
        }
      />

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                Current Filtered
              </p>
              <h4 className="text-xl font-bold text-surface-900 mt-0.5">
                {filteredSubjects.length} Courses
              </h4>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                Total Credit Weight
              </p>
              <h4 className="text-xl font-bold text-surface-900 mt-0.5">
                {totalCredits} Credits
              </h4>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4.5 h-4.5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                Semesters Active
              </p>
              <h4 className="text-xl font-bold text-surface-900 mt-0.5">
                {availableSemesters.length} {availableSemesters.length === 1 ? 'Semester' : 'Semesters'}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        {/* Search Input */}
        <div className="w-full lg:w-96">
          <Input
            placeholder="Search by code, subject name, or lecturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-surface-400 hover:text-surface-600"
                  aria-label="Clear search"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Semester Filter & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Semester Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" /> Semester:
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant={selectedSemester === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedSemester('all')}
              >
                All ({subjects.length})
              </Button>
              {availableSemesters.map((sem) => {
                const count = subjects.filter(
                  (s) => s.semester.toLowerCase() === sem.toLowerCase()
                ).length;
                return (
                  <Button
                    key={sem}
                    variant={selectedSemester.toLowerCase() === sem.toLowerCase() ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedSemester(sem)}
                  >
                    {sem} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-surface-200 rounded-lg p-0.5 bg-surface-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-surface-900 shadow-xs'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-surface-900 shadow-xs'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Subjects Display */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 text-surface-400 mx-auto flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-surface-900">No subjects found</h3>
          <p className="text-sm text-surface-500 max-w-sm mx-auto mt-1">
            {searchQuery || selectedSemester !== 'all'
              ? 'No subjects matched your current search or semester filter.'
              : 'You have not added any subjects yet. Get started by adding your first course.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {searchQuery || selectedSemester !== 'all' ? (
              <Button variant="outline" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            ) : null}
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddModal}
            >
              Add New Subject
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-semibold text-surface-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${subject.color || 'bg-blue-500'}`} />
                    <span className="font-mono font-bold text-surface-700">{subject.code}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-surface-900">
                  {subject.name}
                </TableCell>
                <TableCell className="text-surface-600 text-xs font-medium">
                  {subject.lecturer}
                </TableCell>
                <TableCell>
                  <Badge variant="purple" size="sm">
                    {subject.semester}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="success" size="sm" withDot>
                    {subject.credits} {subject.credits === 1 ? 'Credit' : 'Credits'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEditModal(subject)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenDeleteModal(subject)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSubject}
        initialData={editingSubject}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSubjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        subject={deletingSubject}
      />
    </div>
  );
};
