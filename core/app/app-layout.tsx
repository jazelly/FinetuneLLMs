'use client';

import React, { useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const sidebarRef = useRef(null);

  return (
    <>
      <div
        className="w-12 bg-main-dark flex-shrink-0 flex flex-col items-center justify-between"
        ref={sidebarRef}
      >
        <Sidebar />
      </div>

      <div className="flex flex-col h-full w-full overflow-y-hidden">
        <div className="h-12 flex-shrink-0">
          <Header />
        </div>

        {/* Main content */}
        {children}
      </div>
    </>
  );
}
