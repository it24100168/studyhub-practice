import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Plus, Search, User, Clock, MapPin, BookOpen, Layers } from 'lucide-react';

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  location: string;
  credits: number;
  assignmentsCount: number;
  resourcesCount: number;
  status: 'active' | 'upcoming' | 'completed';
  color: string;
}

const mockSubjects: SubjectItem[] = [
  {
    id: '1',
    code: 'CS 301',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Evelyn Vance',
    schedule: 'Mon / Wed &bull; 10:00 AM - 11:30 AM',
    location: 'Science Hall 204',
    credits: 4,
    assignmentsCount: 5,
    resourcesCount: 12,
    status: 'active',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    code: 'CS 340',
    name: 'Database Management Systems',
    instructor: 'Prof. Marcus Chen',
    schedule: 'Tue / Thu &bull; 01:00 PM - 02:30 PM',
    location: 'Tech Center 110',
    credits: 4,
    assignmentsCount: 3,
    resourcesCount: 8,
    status: 'active',
    color: 'bg-purple-500',
  },
  {
    id: '3',
    code: 'MATH 220',
    name: 'Linear Algebra & Applications',
    instructor: 'Dr. Sophia Reyes',
    schedule: 'Mon / Wed / Fri &bull; 09:00 AM - 10:00 AM',
    location: 'Euler Hall 102',
    credits: 3,
    assignmentsCount: 4,
    resourcesCount: 15,
    status: 'active',
    color: 'bg-emerald-500',
  },
  {
    id: '4',
    code: 'ENG 205',
    name: 'Technical Writing & Communication',
    instructor: 'Prof. David Miller',
    schedule: 'Tue &bull; 03:00 PM - 06:00 PM',
    location: 'Humanities 305',
    credits: 3,
    assignmentsCount: 2,
    resourcesCount: 6,
    status: 'active',
    color: 'bg-amber-500',
  },
];

export const SubjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects & Courses"
        description="Manage your enrolled subjects, course schedules, instructors, and syllabus materials."
        badge={<Badge variant="primary">4 Active Courses</Badge>}
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add New Subject
          </Button>
        }
      />

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search subjects or instructors..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button variant="secondary" size="sm">All Terms</Button>
          <Button variant="outline" size="sm">Active (4)</Button>
          <Button variant="ghost" size="sm">Archived</Button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSubjects.map((subject) => (
          <Card key={subject.id} variant="default" className="flex flex-col">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                  <span className="text-xs font-bold text-surface-500 tracking-wider uppercase">
                    {subject.code}
                  </span>
                </div>
                <Badge variant="success" size="sm" withDot>
                  {subject.credits} Credits
                </Badge>
              </div>
              <CardTitle className="text-lg leading-snug">
                {subject.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-xs text-surface-600">
                <User className="w-3.5 h-3.5 text-surface-400" />
                <span>{subject.instructor}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pt-4">
              <div className="flex items-center gap-2 text-xs text-surface-600">
                <Clock className="w-3.5 h-3.5 text-surface-400" />
                <span dangerouslySetInnerHTML={{ __html: subject.schedule }} />
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-600">
                <MapPin className="w-3.5 h-3.5 text-surface-400" />
                <span>{subject.location}</span>
              </div>
            </CardContent>

            <CardFooter className="bg-surface-50/70 border-t border-surface-100">
              <div className="flex items-center gap-4 text-xs text-surface-500 font-medium">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-surface-400" />
                  {subject.assignmentsCount} Assignments
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-surface-400" />
                  {subject.resourcesCount} Files
                </span>
              </div>
              <Button variant="outline" size="sm">
                View Course
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
