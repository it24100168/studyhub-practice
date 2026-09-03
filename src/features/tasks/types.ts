export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';
export type FilterType = 'all' | 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO date string "YYYY-MM-DD"
  priority: Priority;
  description: string;
  status: TaskStatus;
}

export interface TaskFormData {
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  description: string;
  status: TaskStatus;
}

export interface TaskFormErrors {
  title?: string;
  subject?: string;
  dueDate?: string;
  priority?: string;
}
