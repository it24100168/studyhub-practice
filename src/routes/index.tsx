import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SubjectsPage } from '../features/subjects/SubjectsPage';
import { AssignmentsPage } from '../features/assignments/AssignmentsPage';
import { ResourcesPage } from '../features/resources/ResourcesPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { LoginPage, RegisterPage, ProtectedRoute } from '../features/auth';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
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

