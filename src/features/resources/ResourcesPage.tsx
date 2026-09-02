import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, FileText, ExternalLink, Download, BookMarked, Tag, Folder } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  subjectCode: string;
  type: 'pdf' | 'link' | 'notes' | 'slides';
  fileSize?: string;
  dateAdded: string;
  url?: string;
  tags: string[];
}

const mockResources: ResourceItem[] = [
  {
    id: '1',
    title: 'Graph Algorithms & Shortest Path Lecture Notes',
    subjectCode: 'CS 301',
    type: 'pdf',
    fileSize: '4.2 MB',
    dateAdded: 'Aug 28, 2026',
    tags: ['Graph Theory', 'Dijkstra', 'Notes'],
  },
  {
    id: '2',
    title: 'PostgreSQL Official Documentation & Index Guide',
    subjectCode: 'CS 340',
    type: 'link',
    url: 'https://postgresql.org/docs',
    dateAdded: 'Aug 30, 2026',
    tags: ['SQL', 'Indexes', 'Docs'],
  },
  {
    id: '3',
    title: 'Matrix Transformations & Vector Spaces Cheat Sheet',
    subjectCode: 'MATH 220',
    type: 'notes',
    fileSize: '1.8 MB',
    dateAdded: 'Sep 01, 2026',
    tags: ['Linear Algebra', 'Exam Prep'],
  },
  {
    id: '4',
    title: 'IEEE Technical Report Formatting Slides',
    subjectCode: 'ENG 205',
    type: 'slides',
    fileSize: '12.5 MB',
    dateAdded: 'Aug 22, 2026',
    tags: ['IEEE', 'Style Guide'],
  },
];

export const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Resources"
        description="Central repository for lecture slides, PDF notes, reference links, and study sheets."
        badge={<Badge variant="purple">15 Documents</Badge>}
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Upload Resource
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search notes, PDFs, or tags..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Button variant="secondary" size="sm">All Types</Button>
          <Button variant="outline" size="sm">PDFs</Button>
          <Button variant="outline" size="sm">Links</Button>
          <Button variant="ghost" size="sm">Notes</Button>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockResources.map((resource) => (
          <Card key={resource.id} variant="default" className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="primary">{resource.subjectCode}</Badge>
                {resource.type === 'pdf' && <Badge variant="danger" size="sm">PDF</Badge>}
                {resource.type === 'link' && <Badge variant="info" size="sm">Web Link</Badge>}
                {resource.type === 'notes' && <Badge variant="success" size="sm">Notes</Badge>}
                {resource.type === 'slides' && <Badge variant="warning" size="sm">Slides</Badge>}
              </div>
              <CardTitle className="text-base leading-snug">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Added on {resource.dateAdded} {resource.fileSize && `\u2022 ${resource.fileSize}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 font-medium"
                  >
                    <Tag className="w-3 h-3 text-surface-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="bg-surface-50/60 border-t border-surface-100">
              <Button variant="ghost" size="sm" icon={<BookMarked className="w-3.5 h-3.5" />}>
                Bookmark
              </Button>
              {resource.type === 'link' ? (
                <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open Link
                </Button>
              ) : (
                <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                  Download
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
