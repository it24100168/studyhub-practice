import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useAuth } from '../auth';
import {
  BookOpen,
  FileCheck2,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Dashboard"
        description={`Welcome back, ${firstName}! Here is an overview of your current academic progress, upcoming deadlines, and study stats.`}
        badge={<Badge variant="primary" withDot>Fall 2026</Badge>}

        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Calendar className="w-4 h-4" />}>
              View Calendar
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Quick Add
            </Button>
          </div>
        }
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Enrolled Subjects
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">4 Courses</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-surface-500">
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 16 Credits
              </span>
              <span>this semester</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Pending Assignments
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">3 Due</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>1 assignment due tomorrow</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Study Hours
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">18.5 hrs</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2.4 hrs vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Completed Tasks
                </p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">12 / 15</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-surface-500">
              <span className="font-semibold text-emerald-600">80% completion rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Upcoming Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Assignments & projects requiring immediate attention</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-surface-900">
                      Algorithms Complexity Report
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">CS 301</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-surface-600 font-medium">
                      Tomorrow, 11:59 PM
                    </TableCell>
                    <TableCell>
                      <Badge variant="danger" withDot>High</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-surface-900">
                      Database Schema Design
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple">CS 340</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-surface-600 font-medium">
                      Sep 08, 2026
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning" withDot>Medium</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-surface-900">
                      Linear Algebra Problem Set #4
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">MATH 220</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-surface-600 font-medium">
                      Sep 12, 2026
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" withDot>Low</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Study Focus & Schedule */}
        <div className="space-y-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Today's Focus Plan</CardTitle>
              <CardDescription>Recommended tasks for today's session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-lg border border-surface-200 bg-surface-50/50 flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded text-brand-600 focus:ring-brand-500" defaultChecked />
                <div>
                  <p className="text-sm font-medium text-surface-800 line-through">Review Big-O Trees Chapter 4</p>
                  <p className="text-xs text-surface-500">CS 301 &bull; 45 mins</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-brand-200 bg-brand-50/30 flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded text-brand-600 focus:ring-brand-500" />
                <div>
                  <p className="text-sm font-semibold text-brand-900">Draft Relational Model ER Diagram</p>
                  <p className="text-xs text-brand-600">CS 340 &bull; 60 mins</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-surface-200 bg-surface-50/50 flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded text-brand-600 focus:ring-brand-500" />
                <div>
                  <p className="text-sm font-medium text-surface-800">Solve Eigenvalues Matrix Practice</p>
                  <p className="text-xs text-surface-500">MATH 220 &bull; 30 mins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
