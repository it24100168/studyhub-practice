import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Calendar, LogOut } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAuth } from '../../features/auth';

export interface NavbarProps {
  onOpenSidebar: () => void;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/subjects':
      return 'Subjects';
    case '/assignments':
      return 'Assignments';
    case '/resources':
      return 'Study Resources';
    case '/tasks':
      return 'Study Tasks';
    default:
      return 'StudyHub';
  }
};

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const currentTitle = getPageTitle(location.pathname);
  const { currentUser, logout } = useAuth();
  const initials = getInitials(currentUser?.name);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section: Sidebar toggle & route breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-800 hover:bg-surface-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surface-400 hidden sm:inline">StudyHub</span>
          <span className="text-xs text-surface-300 hidden sm:inline">/</span>
          <h2 className="text-base font-semibold text-surface-800 tracking-tight">{currentTitle}</h2>
        </div>
      </div>

      {/* Middle section: Global Search Bar Placeholder */}
      <div className="hidden md:block flex-1 max-w-md mx-4">
        <Input
          placeholder="Search subjects, assignments, notes... (Ctrl+K)"
          leftIcon={<Search className="w-4 h-4" />}
          className="bg-surface-50 border-surface-200 focus:bg-white text-xs"
        />
      </div>

      {/* Right section: Info items & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Semester tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-100 text-surface-700 text-xs font-medium border border-surface-200">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>Fall Semester 2026</span>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-lg text-surface-500 hover:text-surface-800 hover:bg-surface-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
        </button>

        {/* Profile & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-surface-200">
          <div
            className="w-8 h-8 rounded-lg bg-surface-900 text-white flex items-center justify-center font-bold text-xs shadow-sm"
            title={currentUser?.name || 'Logged in user'}
          >
            {initials}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-surface-800 leading-tight truncate max-w-[120px]">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-[10px] text-surface-400 truncate max-w-[120px]">
              {currentUser?.email || ''}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-surface-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

