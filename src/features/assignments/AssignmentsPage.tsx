import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AssignmentItem, AssignmentStatus } from './types';
import { AssignmentModal } from './AssignmentModal';
import { DeleteAssignmentModal } from './DeleteAssignmentModal';
import {
  Plus,
  Search,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  XCircle,
  Inbox,
} from 'lucide-react';

const STORAGE_KEY = 'studyhub_assignments';

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: '1',
    title: 'Algorithms Complexity Analysis Report',
    subjectCode: 'CS 301',
    dueDate: 'Sep 03, 2026',
    status: 'in_progress',
    priority: 'high',
    type: 'Written Report',
  },
  {
    id: '2',
    title: 'Relational Schema & Normalization ERD',
    subjectCode: 'CS 340',
    dueDate: 'Sep 08, 2026',
    status: 'pending',
    priority: 'high',
    type: 'Project Draft',
  },
  {
    id: '3',
    title: 'Linear Algebra Problem Set #4',
    subjectCode: 'MATH 220',
    dueDate: 'Sep 12, 2026',
    status: 'pending',
    priority: 'medium',
    type: 'Problem Set',
  },
  {
    id: '4',
    title: 'Technical Proposal Peer Review',
    subjectCode: 'ENG 205',
    dueDate: 'Aug 29, 2026',
    status: 'completed',
    priority: 'low',
    type: 'Peer Review',
  },
  {
    id: '5',
    title: 'B-Tree & Hash Index Lab Implementation',
    subjectCode: 'CS 301',
    dueDate: 'Sep 18, 2026',
    status: 'pending',
    priority: 'medium',
    type: 'Coding Lab',
  },
];

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load assignments from localStorage', e);
    }
    return INITIAL_ASSIGNMENTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingAssignment, setEditingAssignment] = useState<AssignmentItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAssignment, setDeletingAssignment] = useState<AssignmentItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // Counts
  const pendingCount = useMemo(
    () => assignments.filter((a) => a.status === 'pending' || a.status === 'in_progress').length,
    [assignments]
  );

  const completedCount = useMemo(
    () => assignments.filter((a) => a.status === 'completed').length,
    [assignments]
  );

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'pending'
          ? item.status === 'pending' || item.status === 'in_progress'
          : item.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subjectCode.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [assignments, statusFilter, searchQuery]);

  // Handlers
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AssignmentItem) => {
    setModalMode('edit');
    setEditingAssignment(item);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<AssignmentItem, 'id'>) => {
    if (modalMode === 'add') {
      const newAssignment: AssignmentItem = {
        ...data,
        id: `asgn_${Date.now()}`,
      };
      setAssignments((prev) => [newAssignment, ...prev]);
    } else if (modalMode === 'edit' && editingAssignment) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? { ...data, id: editingAssignment.id } : a))
      );
    }
  };

  const handleOpenDelete = (item: AssignmentItem) => {
    setDeletingAssignment(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingAssignment) {
      setAssignments((prev) => prev.filter((a) => a.id !== deletingAssignment.id));
      setIsDeleteModalOpen(false);
      setDeletingAssignment(null);
    }
  };

  const renderStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="info" withDot>In Progress</Badge>;
      case 'pending':
        return <Badge variant="warning" withDot>Pending</Badge>;
      case 'completed':
        return <Badge variant="success" withDot>Completed</Badge>;
      case 'overdue':
        return <Badge variant="danger" withDot>Overdue</Badge>;
      default:
        return <Badge variant="default" withDot>{status}</Badge>;
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger" size="sm" withDot>High</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm" withDot>Medium</Badge>;
      case 'low':
        return <Badge variant="default" size="sm" withDot>Low</Badge>;
      default:
        return <Badge variant="default" size="sm">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Assignments Tracker"
        description="Keep track of upcoming homework, lab submissions, essays, and project milestones."
        badge={
          pendingCount > 0 ? (
            <Badge variant="warning" withDot>
              {pendingCount} Pending
            </Badge>
          ) : (
            <Badge variant="success" withDot>
              All Caught Up!
            </Badge>
          )
        }
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            New Assignment
          </Button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search assignment, subject, or type..."
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
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All ({assignments.length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({completedCount})
          </Button>
          <Button
            variant={statusFilter === 'overdue' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('overdue')}
          >
            Overdue ({assignments.filter((a) => a.status === 'overdue').length})
          </Button>
        </div>
      </div>

      {/* Assignments Table or Empty State */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 text-surface-400 mx-auto flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-surface-900">No assignments found</h3>
          <p className="text-sm text-surface-500 max-w-sm mx-auto mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'No assignments matched your current search or status filter.'
              : 'You have no assignments tracked yet. Click "New Assignment" to add your first milestone.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {searchQuery || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : null}
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAdd}
            >
              New Assignment
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-surface-900">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-surface-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="primary">{item.subjectCode}</Badge>
                </TableCell>
                <TableCell className="text-xs text-surface-600 font-medium whitespace-nowrap">
                  {item.type}
                </TableCell>
                <TableCell className="text-xs text-surface-700 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-surface-400" />
                    <span>{item.dueDate}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {renderPriorityBadge(item.priority)}
                </TableCell>
                <TableCell>
                  {renderStatusBadge(item.status)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenDelete(item)}
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
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingAssignment}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAssignmentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        assignment={deletingAssignment}
      />
    </div>
  );
};
