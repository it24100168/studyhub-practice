import React, { useState } from 'react';
import { ResourceItem, ResourceType } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge, BadgeProps } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Video,
  Globe,
  BookOpen,
  Folder,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Check,
  Copy,
} from 'lucide-react';

interface ResourceCardProps {
  resource: ResourceItem;
  onEdit: (resource: ResourceItem) => void;
  onDelete: (resource: ResourceItem) => void;
}

const getTypeConfig = (
  type: ResourceType
): {
  variant: BadgeProps['variant'];
  icon: React.ReactNode;
} => {
  switch (type) {
    case 'Lecture Note':
      return {
        variant: 'purple',
        icon: <FileText className="w-3.5 h-3.5" />,
      };
    case 'Video':
      return {
        variant: 'danger',
        icon: <Video className="w-3.5 h-3.5" />,
      };
    case 'Website':
      return {
        variant: 'info',
        icon: <Globe className="w-3.5 h-3.5" />,
      };
    case 'Book':
      return {
        variant: 'success',
        icon: <BookOpen className="w-3.5 h-3.5" />,
      };
    case 'Other':
    default:
      return {
        variant: 'warning',
        icon: <Folder className="w-3.5 h-3.5" />,
      };
  }
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const typeConfig = getTypeConfig(resource.type);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(resource.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="default" className="flex flex-col h-full hover:shadow-md transition-all duration-200 group">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="primary" size="sm" className="font-semibold">
            {resource.subject}
          </Badge>
          <Badge variant={typeConfig.variant} size="sm" className="flex items-center gap-1">
            {typeConfig.icon}
            <span>{resource.type}</span>
          </Badge>
        </div>

        <CardTitle className="text-base font-semibold text-surface-900 group-hover:text-brand-600 transition-colors line-clamp-2 pt-1">
          {resource.title}
        </CardTitle>

        <CardDescription className="flex items-center gap-1.5 text-xs text-surface-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Added {resource.createdAt}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-2 space-y-3">
        {resource.description ? (
          <p className="text-xs text-surface-600 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        ) : (
          <p className="text-xs text-surface-400 italic">No description provided.</p>
        )}

        {/* Link preview */}
        <div className="flex items-center justify-between gap-2 p-2 bg-surface-50 rounded-lg border border-surface-100 text-xs text-surface-500 font-mono">
          <span className="truncate flex-1 select-all">{resource.link}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-1 text-surface-400 hover:text-surface-700 rounded hover:bg-surface-200/60 transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </CardContent>

      <CardFooter className="bg-surface-50/60 border-t border-surface-100 flex items-center justify-between gap-2 pt-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(resource)}
            icon={<Edit2 className="w-3.5 h-3.5 text-surface-500 hover:text-brand-600" />}
            title="Edit resource"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(resource)}
            icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
            title="Delete resource"
            className="hover:bg-red-50 hover:text-red-700 text-red-600"
          >
            Delete
          </Button>
        </div>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button
            variant="primary"
            size="sm"
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Open Link
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};
