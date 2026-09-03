import { ResourceItem, ResourceType } from './types';

export const RESOURCE_TYPES: ResourceType[] = [
  'Lecture Note',
  'Video',
  'Website',
  'Book',
  'Other',
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Graph Algorithms & Shortest Path Lecture Slides',
    subject: 'CS 301 - Data Structures',
    type: 'Lecture Note',
    link: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-16-dijkstra/',
    description: 'Comprehensive lecture slides covering Dijkstra, Bellman-Ford, and topological sort algorithms with complexity analysis.',
    createdAt: '2026-08-28',
  },
  {
    id: 'res-2',
    title: 'PostgreSQL Indexing and Query Optimization Guide',
    subject: 'CS 340 - Database Management',
    type: 'Website',
    link: 'https://use-the-index-luke.com/',
    description: 'Essential database indexing tutorial for developers. Covers B-Trees, execution plans, and query performance tuning.',
    createdAt: '2026-08-30',
  },
  {
    id: 'res-3',
    title: 'MIT Linear Algebra Video Lecture Series by Gilbert Strang',
    subject: 'MATH 220 - Linear Algebra',
    type: 'Video',
    link: 'https://www.youtube.com/playlist?list=PLE7DDD91010BC451',
    description: 'Complete video lecture collection explaining matrix spaces, eigenvalues, eigenvectors, and singular value decomposition.',
    createdAt: '2026-09-01',
  },
  {
    id: 'res-4',
    title: 'Designing Data-Intensive Applications (E-Book Reference)',
    subject: 'CS 340 - Database Management',
    type: 'Book',
    link: 'https://dataintensive.net/',
    description: 'The definitive guide to distributed data systems, transactions, replication, and storage engine architectures.',
    createdAt: '2026-09-01',
  },
  {
    id: 'res-5',
    title: 'IEEE Technical Writing and Research Paper Style Guide',
    subject: 'ENG 205 - Technical Writing',
    type: 'Other',
    link: 'https://ieeeauthorcenter.ieee.org/create-your-ieee-article/use-authoring-tools-and-templates/ieee-style-manual/',
    description: 'Official formatting standards, citation protocols, and typography guidelines for IEEE scientific conference papers.',
    createdAt: '2026-09-02',
  },
];

const STORAGE_KEY = 'studyhub_resources';

export const getStoredResources = (): ResourceItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load resources from localStorage', err);
  }
  return INITIAL_RESOURCES;
};

export const saveStoredResources = (resources: ResourceItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch (err) {
    console.error('Failed to save resources to localStorage', err);
  }
};
