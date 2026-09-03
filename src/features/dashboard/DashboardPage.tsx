import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useAuth } from '../auth';
import {
  BookOpen,
  FileCheck2,
  FolderKanban,
  CheckSquare,
  ArrowUpRight,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';

// Data types from features
interface Subject {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  semester: string;
  credits: number;
  color?: string;
}

interface AssignmentItem {
  id: string;
  title: string;
  subjectCode: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  type: string;
}

interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  type: string;
  link: string;
  description?: string;
  createdAt: string;
}

interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  status: 'pending' | 'completed';
}

const SUBJECTS_KEY = 'studyhub_subjects';
const ASSIGNMENTS_KEY = 'studyhub_assignments';
const RESOURCES_KEY = 'studyhub_resources';
const TASKS_KEY = 'studyhub_tasks';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  // Load live data from localStorage
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(SUBJECTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(RESOURCES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Re-read storage on mount / focus
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const sub = localStorage.getItem(SUBJECTS_KEY);
        if (sub) setSubjects(JSON.parse(sub));

        const asgn = localStorage.getItem(ASSIGNMENTS_KEY);
        if (asgn) setAssignments(JSON.parse(asgn));

        const res = localStorage.getItem(RESOURCES_KEY);
        if (res) setResources(JSON.parse(res));

        const tsk = localStorage.getItem(TASKS_KEY);
        if (tsk) setTasks(JSON.parse(tsk));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Quick toggle task completion on Dashboard
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' }
        : t
    );
    setTasks(updated);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  };

  // Metrics calculations
  const totalCredits = useMemo(() => {
    return subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
  }, [subjects]);

  const pendingAssignments = useMemo(() => {
    return assignments.filter((a) => a.status === 'pending' || a.status === 'in_progress');
  }, [assignments]);

  const completedAssignments = useMemo(() => {
    return assignments.filter((a) => a.status === 'completed');
  }, [assignments]);

  const pendingTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'pending');
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'completed');
  }, [tasks]);

  const taskCompletionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  }, [tasks, completedTasks]);

  const upcomingDeadlines = useMemo(() => {
    // Priority: pending/in_progress first, limit to top 5
    const pending = assignments.filter((a) => a.status !== 'completed');
    const completed = assignments.filter((a) => a.status === 'completed');
    return [...pending, ...completed].slice(0, 5);
  }, [assignments]);

  const uniqueResourceTypes = useMemo(() => {
    const set = new Set(resources.map((r) => r.type));
    return set.size;
  }, [resources]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Academic Dashboard"
        description={`Welcome back, ${firstName}! Here is a unified summary of your enrolled subjects, assignments, resources, and study tasks.`}
        badge={<Badge variant="primary" withDot>Fall Semester 2026</Badge>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/assignments')}
            >
              New Assignment
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/tasks')}
            >
              Add Task
            </Button>
          </div>
        }
      />

      {/* 4 Main Module Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Subjects Card */}
        <Card
          variant="default"
          className="cursor-pointer hover:border-brand-300 transition-all duration-150 group"
          onClick={() => navigate('/subjects')}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Total Subjects
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">
                  {subjects.length} {subjects.length === 1 ? 'Course' : 'Courses'}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {totalCredits} Credits
              </span>
              <span className="text-brand-600 font-medium group-hover:underline flex items-center">
                View <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Assignments Card */}
        <Card
          variant="default"
          className="cursor-pointer hover:border-amber-300 transition-all duration-150 group"
          onClick={() => navigate('/assignments')}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Total Assignments
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">
                  {assignments.length} Tracked
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {pendingAssignments.length} Pending
              </span>
              <span className="text-emerald-600 font-medium">
                {completedAssignments.length} Done
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Study Resources Card */}
        <Card
          variant="default"
          className="cursor-pointer hover:border-purple-300 transition-all duration-150 group"
          onClick={() => navigate('/resources')}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Study Resources
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">
                  {resources.length} Materials
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-surface-500">
              <span>{uniqueResourceTypes} Media Categories</span>
              <span className="text-brand-600 font-medium group-hover:underline flex items-center">
                Explore <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Study Tasks Card */}
        <Card
          variant="default"
          className="cursor-pointer hover:border-emerald-300 transition-all duration-150 group"
          onClick={() => navigate('/tasks')}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Study Tasks
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">
                  {tasks.length} Daily Goals
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold">
                {completedTasks.length} / {tasks.length} ({taskCompletionRate}%)
              </span>
              <span className="text-surface-500">
                {pendingTasks.length} left
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Deadlines & Priority Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Upcoming Deadlines</span>
                  {pendingAssignments.length > 0 && (
                    <Badge variant="warning" size="sm" withDot>
                      {pendingAssignments.length} Due Soon
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Assignments & course deliverables sorted by priority
                </CardDescription>
              </div>
              <Link to="/assignments">
                <Button variant="ghost" size="sm">
                  View All ({assignments.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingDeadlines.length === 0 ? (
                <div className="p-8 text-center text-surface-500 text-sm">
                  No upcoming assignments scheduled. Click "New Assignment" to add one.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingDeadlines.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold text-surface-900 max-w-[200px] truncate">
                          {item.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="primary">{item.subjectCode}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-surface-600 font-medium whitespace-nowrap">
                          {item.dueDate}
                        </TableCell>
                        <TableCell>
                          {item.priority === 'high' && (
                            <Badge variant="danger" size="sm" withDot>
                              High
                            </Badge>
                          )}
                          {item.priority === 'medium' && (
                            <Badge variant="warning" size="sm" withDot>
                              Medium
                            </Badge>
                          )}
                          {item.priority === 'low' && (
                            <Badge variant="default" size="sm" withDot>
                              Low
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.status === 'in_progress' && (
                            <Badge variant="info" size="sm" withDot>
                              In Progress
                            </Badge>
                          )}
                          {item.status === 'pending' && (
                            <Badge variant="warning" size="sm" withDot>
                              Pending
                            </Badge>
                          )}
                          {item.status === 'completed' && (
                            <Badge variant="success" size="sm" withDot>
                              Completed
                            </Badge>
                          )}
                          {item.status === 'overdue' && (
                            <Badge variant="danger" size="sm" withDot>
                              Overdue
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/assignments')}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Enrolled Subjects Overview */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Enrolled Courses Overview</CardTitle>
                <CardDescription>
                  Your current academic courses and faculty instructors
                </CardDescription>
              </div>
              <Link to="/subjects">
                <Button variant="ghost" size="sm">
                  Manage Subjects
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-surface-200 bg-surface-50/40 hover:bg-white hover:border-surface-300 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${sub.color || 'bg-blue-500'}`} />
                        <span className="font-mono text-xs font-bold text-surface-600 uppercase">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-surface-900 truncate">
                        {sub.name}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {sub.lecturer}
                      </p>
                    </div>
                    <Badge variant="success" size="sm">
                      {sub.credits} cr
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Study Tasks & Resources */}
        <div className="space-y-6">
          {/* Today's Study Tasks */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Study Tasks</CardTitle>
                <CardDescription>
                  Check off daily goals directly
                </CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  View ({tasks.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5 p-4">
              {/* Progress bar */}
              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-surface-600">
                  <span>Progress</span>
                  <span className="font-bold text-surface-900">{taskCompletionRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${taskCompletionRate}%` }}
                  />
                </div>
              </div>

              {tasks.length === 0 ? (
                <p className="text-xs text-surface-500 text-center py-4">
                  No tasks created yet.
                </p>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      task.status === 'completed'
                        ? 'bg-surface-50/50 border-surface-200 opacity-75'
                        : 'bg-white border-surface-200 hover:border-brand-300 shadow-xs'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleTask(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-surface-300 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          task.status === 'completed'
                            ? 'line-through text-surface-400'
                            : 'text-surface-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-surface-500">
                        <span className="font-semibold text-brand-700">{task.subject}</span>
                        {task.dueDate && <span>&bull; Due {task.dueDate}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Study Resources */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>Quick access to syllabus links</CardDescription>
              </div>
              <Link to="/resources">
                <Button variant="ghost" size="sm">
                  All ({resources.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {resources.length === 0 ? (
                <p className="text-xs text-surface-500 text-center py-3">
                  No resources saved yet.
                </p>
              ) : (
                resources.slice(0, 3).map((res) => (
                  <a
                    key={res.id}
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-surface-200 bg-surface-50/30 hover:bg-white hover:border-brand-300 transition-colors flex items-start justify-between gap-2 group block"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-surface-900 truncate group-hover:text-brand-600">
                        {res.title}
                      </p>
                      <p className="text-[11px] text-surface-500 mt-0.5 truncate">
                        {res.subject} &bull; <span className="font-medium text-surface-700">{res.type}</span>
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-surface-400 group-hover:text-brand-600 shrink-0 mt-0.5" />
                  </a>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
