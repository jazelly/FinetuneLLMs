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

const DefaultChat = lazy(() => import('@/pages/DefaultChat'));
const InvitePage = lazy(() => import('@/pages/Invite'));
const Pipeline = lazy(() => import('@/pages/Pipeline.page'));
// const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat")); // TODO: integarte to testing field
const Dashboard = lazy(() => import('@/pages/Dashboard.page'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users'));
const AdminInvites = lazy(() => import('@/pages/Admin/Invitations'));
const AdminWorkspaces = lazy(() => import('@/pages/Admin/Workspaces'));
const AdminSystem = lazy(() => import('@/pages/Admin/System'));
const GeneralChats = lazy(() => import('@/pages/GeneralSettings/Chats'));
const GeneralAppearance = lazy(
  () => import('@/pages/GeneralSettings/Appearance')
);
const GeneralApiKeys = lazy(() => import('@/pages/GeneralSettings/ApiKeys'));
const GeneralLLMPreference = lazy(
  () => import('@/pages/GeneralSettings/LLMPreference')
);
const PrivacyAndData = lazy(
  () => import('@/pages/GeneralSettings/PrivacyAndData')
);

export default function App() {
  const sidebarRef = useRef(null);
  const {
    showing: showingUpload,
    showModal: showUploadModal,
    hideModal: hideUploadModal,
  } = useUploadDatasetsModal();

  return (
    <Suspense fallback={<div />}>
      <ContextWrapper>
        <LogoProvider>
          <PermalinksProvider>
            <TrainerMessageMapProvider>
              <div className="bg-main-base flex h-full">
                {showingUpload && (
                  <UploadDatasets hideModal={hideUploadModal} />
                )}

                {!isMobile && (
                  <div
                    className={`w-16 h-full flex-shrink-0 p-2 flex flex-col items-center justify-between`}
                    ref={sidebarRef}
                  >
                    <Sidebar />
                  </div>
                )}
                <div className="flex flex-col h-full w-full overflow-y-hidden">
                  <div className="h-[64px] flex-shrink-0">
                    <Header showUploadModal={showUploadModal} />
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
                      path="/job/logs"
                      element={<PrivateRoute Component={DefaultChat} />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/accept-invite/:code"
                      element={<InvitePage />}
                    />

                    {/* Admin */}
                    <Route
                      path="/settings"
                      element={<AdminRoute Component={GeneralLLMPreference} />}
                    />

                    {/* Manager */}
                    <Route
                      path="/settings/privacy"
                      element={<AdminRoute Component={PrivacyAndData} />}
                    />
                    <Route
                      path="/settings/appearance"
                      element={<ManagerRoute Component={GeneralAppearance} />}
                    />
                    <Route
                      path="/settings/api-keys"
                      element={<AdminRoute Component={GeneralApiKeys} />}
                    />
                    <Route
                      path="/settings/workspace-chats"
                      element={<ManagerRoute Component={GeneralChats} />}
                    />
                    <Route
                      path="/settings/system-preferences"
                      element={<ManagerRoute Component={AdminSystem} />}
                    />
                    <Route
                      path="/settings/invites"
                      element={<ManagerRoute Component={AdminInvites} />}
                    />
                    <Route
                      path="/settings/users"
                      element={<ManagerRoute Component={AdminUsers} />}
                    />
                    <Route
                      path="/settings/workspaces"
                      element={<ManagerRoute Component={AdminWorkspaces} />}
                    />
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
