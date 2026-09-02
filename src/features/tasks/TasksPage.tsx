import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, CheckSquare, Clock, AlertCircle, Sparkles, Filter } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  subjectCode: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const mockTasks: TaskItem[] = [
  {
    id: '1',
    title: 'Read Data Structures Chapter 4 on Red-Black Trees',
    subjectCode: 'CS 301',
    estimatedMinutes: 45,
    completed: true,
    priority: 'medium',
    dueDate: 'Today',
  },
  {
    id: '2',
    title: 'Draft Relational Model Schema Diagram for DBMS Project',
    subjectCode: 'CS 340',
    estimatedMinutes: 60,
    completed: false,
    priority: 'high',
    dueDate: 'Today',
  },
  {
    id: '3',
    title: 'Solve Eigenvalues & Eigenvectors Practice Problems 1-10',
    subjectCode: 'MATH 220',
    estimatedMinutes: 30,
    completed: false,
    priority: 'medium',
    dueDate: 'Tomorrow',
  },
  {
    id: '4',
    title: 'Outline Literature Review for Technical Communication Essay',
    subjectCode: 'ENG 205',
    estimatedMinutes: 40,
    completed: false,
    priority: 'low',
    dueDate: 'Sep 05',
  },
  {
    id: '5',
    title: 'Review Midterm Flashcards for CS 301',
    subjectCode: 'CS 301',
    estimatedMinutes: 25,
    completed: true,
    priority: 'high',
    dueDate: 'Yesterday',
  },
];

export const TasksPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Tasks"
        description="Organize daily study goals, break down assignments into bite-sized tasks, and track study duration."
        badge={<Badge variant="success" withDot>3 Tasks Remaining</Badge>}
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add Study Task
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search task title..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Button variant="secondary" size="sm">All Tasks</Button>
          <Button variant="outline" size="sm">Pending (3)</Button>
          <Button variant="ghost" size="sm">Completed (2)</Button>
        </div>
      </div>

      {/* Task List Card Container */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Study Tasks</CardTitle>
            <CardDescription>Click to mark tasks as completed</CardDescription>
          </div>
          <div className="text-xs text-surface-500 font-medium">
            Total Estimated: <span className="font-bold text-surface-800">3.3 hrs</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-surface-100">
          {mockTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-start sm:items-center justify-between gap-4 transition-colors ${
                task.completed ? 'bg-surface-50/50 opacity-75' : 'hover:bg-surface-50/40'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  className="mt-1 sm:mt-0 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-surface-300 cursor-pointer"
                />
                <div className="space-y-1">
                  <p
                    className={`text-sm font-medium text-surface-900 ${
                      task.completed ? 'line-through text-surface-500' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-surface-500">
                    <Badge variant="primary" size="sm">
                      {task.subjectCode}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-surface-400" />
                      {task.estimatedMinutes} mins
                    </span>
                    <span>&bull;</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.priority === 'high' && <Badge variant="danger" size="sm" withDot>High</Badge>}
                {task.priority === 'medium' && <Badge variant="warning" size="sm" withDot>Med</Badge>}
                {task.priority === 'low' && <Badge variant="default" size="sm" withDot>Low</Badge>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
