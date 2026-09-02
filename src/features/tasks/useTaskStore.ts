import { useState, useCallback, useMemo } from 'react';
import { Task, TaskFormData, FilterType } from './types';

const STORAGE_KEY = 'studyhub_tasks';

const generateId = (): string =>
  `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const loadFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultTasks();
    return JSON.parse(raw) as Task[];
  } catch {
    return getDefaultTasks();
  }
};

const saveToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // silently fail if storage is unavailable
  }
};

function getDefaultTasks(): Task[] {
  const today = new Date();
  const fmt = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'default_1',
      title: 'Read Data Structures Chapter 4 on Red-Black Trees',
      subject: 'CS 301',
      dueDate: fmt(0),
      priority: 'medium',
      description: 'Focus on insertion and deletion rotations.',
      status: 'completed',
    },
    {
      id: 'default_2',
      title: 'Draft Relational Model Schema Diagram for DBMS Project',
      subject: 'CS 340',
      dueDate: fmt(0),
      priority: 'high',
      description: 'Include all entity relationships and normalisation up to 3NF.',
      status: 'pending',
    },
    {
      id: 'default_3',
      title: 'Solve Eigenvalues & Eigenvectors Practice Problems 1–10',
      subject: 'MATH 220',
      dueDate: fmt(1),
      priority: 'medium',
      description: '',
      status: 'pending',
    },
    {
      id: 'default_4',
      title: 'Outline Literature Review for Technical Communication Essay',
      subject: 'ENG 205',
      dueDate: fmt(3),
      priority: 'low',
      description: 'At least 5 peer-reviewed sources required.',
      status: 'pending',
    },
    {
      id: 'default_5',
      title: 'Review Midterm Flashcards for CS 301',
      subject: 'CS 301',
      dueDate: fmt(-1),
      priority: 'high',
      description: '',
      status: 'completed',
    },
  ];
}

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage());
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveToStorage(updated);
  }, []);

  const addTask = useCallback(
    (formData: TaskFormData) => {
      const newTask: Task = {
        id: generateId(),
        ...formData,
      };
      persist([newTask, ...tasks]);
    },
    [tasks, persist]
  );

  const updateTask = useCallback(
    (id: string, formData: TaskFormData) => {
      persist(tasks.map((t) => (t.id === id ? { ...t, ...formData } : t)));
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter((t) => t.id !== id));
    },
    [tasks, persist]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      persist(
        tasks.map((t) =>
          t.id === id
            ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
            : t
        )
      );
    },
    [tasks, persist]
  );

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter !== 'all') {
      result = result.filter((t) => t.status === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, filter, searchQuery]);

  const pendingCount = useMemo(
    () => tasks.filter((t) => t.status === 'pending').length,
    [tasks]
  );
  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === 'completed').length,
    [tasks]
  );

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    pendingCount,
    completedCount,
  };
};
