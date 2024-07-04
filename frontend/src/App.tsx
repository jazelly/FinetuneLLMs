import React, { lazy, Suspense, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContextWrapper } from '@/contexts/AuthContext';
import PrivateRoute, { AdminRoute } from '@/components/PrivateRoute';

import { ManagerRoute } from '@/components/ManagerRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from '@/pages/Login';
import { isMobile } from 'react-device-detect';
import { LogoProvider } from '@/contexts/LogoContext';
import { PermalinksProvider } from '@/contexts/Permalinks.context';
import Sidebar from '@/components/Sidebar';
import Header from './components/Header.component';
import UploadDatasets, {
  useUploadDatasetsModal,
} from '@/components/Modals/UploadDatasets';
import { TrainerMessageMapProvider } from './contexts/TrainerMessageMap.context';
import Settings from './pages/Settings.page';
import NotFound from './pages/404.page';

const Logs = lazy(() => import('@/pages/Logs.page'));
const InvitePage = lazy(() => import('@/pages/Invite'));
const Pipeline = lazy(() => import('@/pages/Pipeline.page'));
// const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat")); // TODO: integarte to testing field
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
                    <Route
                      path="/"
                      element={<PrivateRoute Component={Dashboard} />}
                    />
                    <Route
                      path="/job/:jobId"
                      element={<PrivateRoute Component={Pipeline} />}
                    />
                    <Route
                      path="/jobs"
                      element={<PrivateRoute Component={Logs} />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/accept-invite/:code"
                      element={<InvitePage />}
                    />

                    <Route
                      path="/settings/*"
                      element={<AdminRoute Component={Settings} />}
                    />
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
