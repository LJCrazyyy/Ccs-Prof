import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-main">
      <div className="pointer-events-none absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-8 md:pb-8 md:pt-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
