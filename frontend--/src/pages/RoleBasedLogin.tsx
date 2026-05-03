import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const getErrorMessage = (errorCode: string): string => {
  const errorMap: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/user-not-found': 'No account exists with this email. Check the email address or create an account first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check both and try again.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
    'auth/operation-not-allowed': 'Login is currently unavailable. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      'Firebase Auth is not configured correctly for this deployment. Check the Netlify environment variables and Firebase authorized domains.',
    'auth/invalid-api-key':
      'Firebase Auth is not configured correctly for this deployment. Check the Netlify environment variables and Firebase authorized domains.',
    'auth/internal-error': 'An error occurred. Please try again later.',
  };
  return errorMap[errorCode] || 'Login failed. Please check your email and password.';
};

interface StudentLoginProps {
  role: 'student' | 'faculty' | 'admin';
  roleLabel: string;
}

export const RoleBasedLogin: React.FC<StudentLoginProps> = ({ role, roleLabel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const { login, isLoading: authLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      const nextPath = role === 'admin' ? '/dashboard/admin/subjects' : `/dashboard/${role}`;
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate, role]);

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setGeneralError('');
    setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setGeneralError('');
    setPasswordError('');
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    try {
      console.log('[LOGIN] Submitting login form for:', email);
      await login(email.trim(), password);
    } catch (err: any) {
      const errorCode = err?.code || '';
      const errorMsg = err?.message || 'Login failed. Please check your email and password.';
      const resolvedMessage = errorCode ? getErrorMessage(errorCode) : errorMsg;

      console.error('[LOGIN] Form login error:', { code: errorCode, message: errorMsg });
      setGeneralError(resolvedMessage);
    }
  };

  const quickLogin = async (credentials: { email: string; password: string }) => {
    setGeneralError('');
    setEmailError('');
    setPasswordError('');
    try {
      console.log('[LOGIN] Quick login attempt for:', credentials.email);
      await login(credentials.email.trim(), credentials.password);
    } catch (err: any) {
      const errorCode = err?.code || '';
      const errorMsg = err?.message || 'Login failed. Please check your email and password.';
      const resolvedMessage = errorCode ? getErrorMessage(errorCode) : errorMsg;

      console.error('[LOGIN] Quick login error:', { code: errorCode, message: errorMsg, email: credentials.email });
      setGeneralError(resolvedMessage);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-800 font-medium">Signing in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4 md:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-2xl shadow-slate-900/10 backdrop-blur md:grid-cols-2">
        <div className="hidden bg-teal-900 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-teal-200">Role Portal</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight">{roleLabel} Access</h2>
            <p className="mt-4 text-teal-100">
              Secure sign-in for the {roleLabel.toLowerCase()} workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-teal-700 bg-teal-800/60 p-4">
            <p className="text-xs uppercase tracking-wide text-teal-200">Institution</p>
            <p className="mt-1 text-lg font-semibold">College of Computing Studies</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
        <button
          onClick={() => navigate('/role-selection')}
          className="mb-6 flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back to Roles
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{roleLabel} Login</h1>
          <p className="text-slate-600">Sign in to your {roleLabel.toLowerCase()} account</p>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-6 border border-teal-100">
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-red-700 text-sm font-medium">Unable to sign in</p>
                <p className="text-red-600 text-sm mt-1">{generalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 outline-none transition ${
                  emailError ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-400'
                }`}
                placeholder="your.email@example.com"
              />
              {emailError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 outline-none transition ${
                  passwordError ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-400'
                }`}
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-sm p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 text-center uppercase tracking-wider">Demo {roleLabel} Account</h3>
          <button
            onClick={() =>
              quickLogin({
                email: role === 'student' ? 'student@example.com' : role === 'faculty' ? 'faculty@example.com' : 'admin@example.com',
                password: role === 'student' ? 'student123' : role === 'faculty' ? 'faculty123' : 'admin123',
              })
            }
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium transition shadow-md"
          >
            Quick {roleLabel} Login
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
