/**
 * Layout.jsx
 * Root layout component that wraps all pages.
 * Manages the mobile sidebar drawer state.
 */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';

export default function Layout() {
  // Controls the mobile sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Sidebar (desktop fixed, mobile drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content rendered by router */}
        <main className="flex-1 p-5 md:p-7">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications — renders outside of page flow */}
      <ToastContainer />
    </div>
  );
}
