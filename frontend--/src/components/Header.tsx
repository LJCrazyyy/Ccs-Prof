import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, Loader } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, navigate to login
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-3 shadow-sm md:px-5">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={22} className="text-slate-700" />
          </button>
        )}
        <div className="flex items-center gap-3">
          {/* University Logo */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rglFWmLitQbBPWPvlaUmQHDHI2YiM8.png"
            alt="University of Cabuyao"
            className="h-10 w-10 rounded-full border border-teal-100 shadow-sm"
          />
          {/* College Logo */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JiGNt42HwaPEYoifHlLe8u2pfYzP0m.png"
            alt="College of Computing Studies"
            className="h-10 w-10 rounded-full border border-teal-100 shadow-sm"
          />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-teal-800">CCS Profiling</h1>
            <p className="text-[11px] font-medium text-slate-500">University of Cabuyao</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden rounded-xl bg-teal-50 px-3 py-2 text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 disabled:bg-slate-400"
        >
          {isLoggingOut ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
      </div>
    </header>
  );
};
