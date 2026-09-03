import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Subject } from './types';
import { User, Calendar, Award, Edit2, Trash2 } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
  onDelete,
}) => {
  return (
    <Card variant="default" className="flex flex-col group hover:border-surface-300 transition-all duration-200">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${subject.color || 'bg-blue-500'} shadow-xs`} />
            <span className="text-xs font-bold text-surface-600 tracking-wider uppercase font-mono">
              {subject.code}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="purple" size="sm">
              {subject.semester}
            </Badge>
            <Badge variant="success" size="sm" withDot>
              {subject.credits} {subject.credits === 1 ? 'Credit' : 'Credits'}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-lg leading-snug font-bold text-surface-900 line-clamp-2 min-h-[3rem]">
          {subject.name}
        </CardTitle>

        <CardDescription className="flex items-center gap-2 text-xs text-surface-600">
          <User className="w-3.5 h-3.5 text-surface-400 shrink-0" />
          <span className="font-medium truncate">{subject.lecturer}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pt-3">
        <div className="flex items-center gap-2 text-xs text-surface-600">
          <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
          <span>Semester: <strong className="text-surface-800 font-semibold">{subject.semester}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-600">
          <Award className="w-3.5 h-3.5 text-surface-400 shrink-0" />
          <span>Academic Weight: <strong className="text-surface-800 font-semibold">{subject.credits} Credit Units</strong></span>
        </div>
      </CardContent>

      <CardFooter className="bg-surface-50/70 border-t border-surface-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-surface-400">
          ID: #{subject.id.slice(0, 4)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => onEdit(subject)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => onDelete(subject)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
