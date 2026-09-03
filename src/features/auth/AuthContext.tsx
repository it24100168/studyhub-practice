import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginFormData, RegisterFormData } from './types';

const USERS_STORAGE_KEY = 'studyhub_users';
const SESSION_STORAGE_KEY = 'studyhub_session';

const DEMO_USERS: User[] = [
  {
    id: 'demo-user-1',
    name: 'Alex Morgan',
    email: 'alex@studyhub.edu',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize users in localStorage if not present
  useEffect(() => {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
    }
  }, []);

  // Initialize session from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.user) {
          return parsed.user;
        }
      }
    } catch (e) {
      console.error('Error restoring auth session', e);
    }
    return null;
  });

  const getStoredUsers = (): User[] => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading stored users', e);
    }
    return DEMO_USERS;
  };

  const login = ({ email, password }: LoginFormData): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      };
    }

    const safeUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    setCurrentUser(safeUser);
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ user: safeUser, loginTime: new Date().toISOString() })
    );

    return { success: true };
  };

  const register = ({
    name,
    email,
    password,
  }: RegisterFormData): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (emailExists) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please log in instead.',
      };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    const safeUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    setCurrentUser(safeUser);
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ user: safeUser, loginTime: new Date().toISOString() })
    );

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
