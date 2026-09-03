export interface Subject {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  semester: string;
  credits: number;
  description?: string;
  color?: string;
}

export interface SubjectFormData {
  code: string;
  name: string;
  lecturer: string;
  semester: string;
  credits: string | number;
  description?: string;
  color?: string;
}

export interface SubjectFormErrors {
  code?: string;
  name?: string;
  lecturer?: string;
  semester?: string;
  credits?: string;
}
