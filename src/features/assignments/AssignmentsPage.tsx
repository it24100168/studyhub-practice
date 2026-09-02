import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Filter, Calendar, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface AssignmentItem {
  id: string;
  title: string;
  subjectCode: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  type: string;
}

const mockAssignments: AssignmentItem[] = [
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
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments Tracker"
        description="Keep track of upcoming homework, lab submissions, essays, and project milestones."
        badge={<Badge variant="warning" withDot>3 Pending</Badge>}
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Assignment
          </Button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search assignment title or subject..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
          <Button variant="secondary" size="sm">All (5)</Button>
          <Button variant="outline" size="sm">Pending (3)</Button>
          <Button variant="ghost" size="sm">Completed (1)</Button>
          <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>
            Filter
          </Button>
        </div>
      </div>

      {/* Assignments Table */}
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
          {mockAssignments.map((item) => (
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
              <TableCell className="text-xs text-surface-600 font-medium">
                {item.type}
              </TableCell>
              <TableCell className="text-xs text-surface-700 font-medium whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-surface-400" />
                  <span>{item.dueDate}</span>
                </div>
              </TableCell>
              <TableCell>
                {item.priority === 'high' && <Badge variant="danger" withDot>High</Badge>}
                {item.priority === 'medium' && <Badge variant="warning" withDot>Medium</Badge>}
                {item.priority === 'low' && <Badge variant="default" withDot>Low</Badge>}
              </TableCell>
              <TableCell>
                {item.status === 'in_progress' && (
                  <Badge variant="info" withDot>In Progress</Badge>
                )}
                {item.status === 'pending' && (
                  <Badge variant="warning" withDot>Pending</Badge>
                )}
                {item.status === 'completed' && (
                  <Badge variant="success" withDot>Completed</Badge>
                )}
                {item.status === 'overdue' && (
                  <Badge variant="danger" withDot>Overdue</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
