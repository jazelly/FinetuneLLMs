import React, { lazy, Suspense, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContextWrapper } from '@/contexts/AuthContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from '@/pages/Login';
import { isMobile } from 'react-device-detect';
import { LogoProvider } from '@/contexts/LogoContext';
import { PermalinksProvider } from '@/contexts/Permalinks.context';
import Sidebar from '@/components/Sidebar.component';
import Header from './components/Header.component';
import { TrainerMessageMapProvider } from './contexts/TrainerMessageMap.context';
import Settings from './pages/Settings.page';
import NotFound from './pages/404.page';
import paths from './utils/paths';

const Pipelines = lazy(() => import('@/pages/Pipelines.page'));
const Pipeline = lazy(() => import('@/pages/Pipeline.page'));
const Dashboard = lazy(() => import('@/pages/Dashboard.page'));

export default function App() {
  const sidebarRef = useRef(null);

  return (
    <Suspense fallback={<div />}>
      <ContextWrapper>
        <LogoProvider>
          <PermalinksProvider>
            <TrainerMessageMapProvider>
              <div className="bg-main-base text-white flex h-full">
                {!isMobile && (
                  <div
                    className={`w-16 h-full bg-main-dark flex-shrink-0 p-2 flex flex-col items-center justify-between`}
                    ref={sidebarRef}
                  >
                    <Sidebar />
                  </div>
                )}
                <div className="flex flex-col h-full w-full overflow-y-hidden">
                  <div className="h-[64px] flex-shrink-0">
                    <Header />
                  </div>

                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/job/:jobId" element={<Pipeline />} />
                    <Route path={paths.pipelines} element={<Pipelines />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/settings/*" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <ToastContainer />
              </div>
            </TrainerMessageMapProvider>
          </PermalinksProvider>
        </LogoProvider>
      </ContextWrapper>
    </Suspense>
  );
}
