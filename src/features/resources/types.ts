export type ResourceType = 'Lecture Note' | 'Video' | 'Website' | 'Book' | 'Other';

export interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  link: string;
  description: string;
  createdAt: string;
}

export interface ResourceFormData {
  title: string;
  subject: string;
  type: ResourceType;
  link: string;
  description: string;
}

export interface FormErrors {
  title?: string;
  subject?: string;
  type?: string;
  link?: string;
  description?: string;
}
