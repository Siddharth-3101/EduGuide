import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative transition-colors duration-300">
      {/* 12 Vertical Blueprint Architectural Grid Columns from reference */}
      <div className="blueprint-grid-overlay">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="blueprint-grid-col" />
        ))}
      </div>

      {/* Top Navbar with ☾ theme toggle */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 pb-20 lg:pb-12 min-w-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
};
