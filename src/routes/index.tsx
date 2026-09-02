import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SubjectsPage } from '../features/subjects/SubjectsPage';
import { AssignmentsPage } from '../features/assignments/AssignmentsPage';
import { ResourcesPage } from '../features/resources/ResourcesPage';
import { TasksPage } from '../features/tasks/TasksPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
