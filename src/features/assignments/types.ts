export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type AssignmentPriority = 'high' | 'medium' | 'low';

export interface AssignmentItem {
  id: string;
  title: string;
  subjectCode: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  type: string;
  description?: string;
}

export interface AssignmentFormData {
  title: string;
  subjectCode: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  type: string;
  description?: string;
}

export interface AssignmentFormErrors {
  title?: string;
  subjectCode?: string;
  dueDate?: string;
  type?: string;
}
