import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Shield, Users } from 'lucide-react';

type Role = 'student' | 'faculty' | 'admin';

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roles: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'View your courses, grades, and academic progress',
    icon: <BookOpen size={48} />,
  },
  {
    id: 'faculty',
    title: 'Faculty',
    description: 'Manage courses, grades, and student performance',
    icon: <Users size={48} />,
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage users, courses, and system settings',
    icon: <Shield size={48} />,
  },
];

export const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}-login`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-main px-4 py-8 md:px-6 md:py-10">
      <div className="pointer-events-none absolute -left-20 top-20 h-60 w-60 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur lg:grid-cols-[1.2fr_1.8fr] lg:p-10">
        <div className="rounded-3xl bg-teal-900 p-8 text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-teal-200">Welcome</p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">Academic Profiling Hub</h1>
          <p className="mt-4 max-w-md text-teal-100">
            Choose the role you use today. Your dashboard, permissions, and shortcuts are tailored for each track.
          </p>
          <div className="mt-8 rounded-2xl border border-teal-700 bg-teal-800/60 p-4">
            <p className="text-sm text-teal-100">PAMANTASAN NG CABUYAO</p>
            <p className="mt-1 text-xl font-bold">College of Computing Studies</p>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Select your portal</h2>
            <p className="mt-1 text-sm text-slate-600">Role-based entry keeps data and actions scoped correctly.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative rounded-2xl border p-6 text-left transition-all duration-300 ${
                selectedRole === role.id
                  ? 'border-primary bg-teal-50 shadow-xl shadow-teal-900/10'
                  : 'border-slate-200 bg-white/80 shadow-sm hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg'
              }`}
            >
              {selectedRole === role.id && (
                <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className="mb-5 flex">
                <div className={`rounded-2xl p-3 transition-all ${
                  selectedRole === role.id
                    ? 'bg-primary text-white'
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  {role.icon}
                </div>
              </div>

              <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                selectedRole === role.id
                  ? 'text-teal-900'
                  : 'text-slate-800'
              }`}>
                {role.title}
              </h3>

              <p className={`text-sm leading-relaxed transition-colors ${
                selectedRole === role.id
                  ? 'text-teal-700'
                  : 'text-slate-600'
              }`}>
                {role.description}
              </p>
            </button>
          ))}
          </div>

          <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-semibold transition-all duration-300 ${
              selectedRole
                ? 'bg-primary text-white shadow-lg shadow-teal-900/20 hover:bg-primary-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'Role'}
            <ArrowRight size={18} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
