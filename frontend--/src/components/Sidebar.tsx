import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItems } from '../lib/constants';
import * as Icons from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const items = menuItems[user.role];

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      LayoutDashboard: Icons.LayoutDashboard,
      Users: Icons.Users,
      Users2: Icons.Users2,
      Calendar: Icons.Calendar,
      BookOpen: Icons.BookOpen,
      CalendarDays: Icons.CalendarDays,
      FileText: Icons.FileText,
      Settings: Icons.Settings,
      User: Icons.User,
      BookMarked: Icons.BookMarked,
      Briefcase: Icons.Briefcase,
      ShieldAlert: Icons.ShieldAlert,
      ClipboardList: Icons.ClipboardList,
      Bell: Icons.Bell,
    };
    const Icon = iconMap[iconName];
    return Icon ? <Icon size={20} /> : null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/45 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[84px] z-40 h-[calc(100vh-96px)] w-72 overflow-y-auto rounded-r-3xl border border-white/70 bg-white/85 p-2 shadow-xl shadow-slate-900/10 backdrop-blur transition-transform duration-300 md:static md:top-auto md:h-auto md:translate-x-0 md:rounded-3xl md:shadow-lg md:shadow-slate-900/5 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-teal-900/15'
                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                }`
              }
            >
              {getIcon(item.icon)}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
