import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LoginFormData, LoginFormErrors } from './types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = login(formData);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrors({ general: result.error || 'Failed to sign in' });
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setFormData({
      email: 'alex@studyhub.edu',
      password: 'password123',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/25 mb-1">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
          Welcome to Study<span className="text-brand-600">Hub</span>
        </h1>
        <p className="text-sm text-surface-500 max-w-sm">
          Sign in to your academic dashboard to manage subjects, assignments, and study tasks.
        </p>
      </div>

      {/* Main Login Card */}
      <Card variant="default" className="w-full max-w-md shadow-xl border-surface-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-surface-900">Sign In</h2>
            <Badge variant="primary" size="sm">Prototype Auth</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="alex@studyhub.edu"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-surface-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              icon={<LogIn className="w-4 h-4" />}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-5 p-3 rounded-xl bg-brand-50/60 border border-brand-100 flex items-center justify-between gap-3">
            <div className="text-xs text-brand-900">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Demo Account:
              </span>
              <span className="text-[11px] text-brand-700 block">alex@studyhub.edu &bull; password123</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickDemoFill}
              className="bg-white border-brand-200 text-brand-700 hover:bg-brand-50 text-xs shrink-0"
            >
              Fill Demo
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-surface-50/60 border-t border-surface-100 flex items-center justify-center p-4">
          <p className="text-xs text-surface-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-0.5"
            >
              Create an account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
