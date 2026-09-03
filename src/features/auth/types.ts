export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: User;
  token?: string;
  loginTime?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => { success: boolean; error?: string };
  register: (data: RegisterFormData) => { success: boolean; error?: string };
  logout: () => void;
}
