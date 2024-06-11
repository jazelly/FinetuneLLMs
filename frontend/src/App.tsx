import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "@/AuthContext";
import PrivateRoute, { AdminRoute } from "@/components/PrivateRoute";

import { ManagerRoute } from "@/components/ManagerRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/pages/Login";
import { isMobile } from "react-device-detect";
import { LogoProvider } from "./LogoContext";
import Sidebar from "@/components/Sidebar";
import Header from "./components/Header";
import UploadDatasets, {
  useUploadDatasetsModal,
} from "@/components/Modals/UploadDatasets";

const DefaultChat = lazy(() => import("@/pages/DefaultChat"));
const InvitePage = lazy(() => import("@/pages/Invite"));
// const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat")); // TODO: integarte to testing field
const Dashboard = lazy(() => import("@/pages/Dashboard.page"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminInvites = lazy(() => import("@/pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("@/pages/Admin/Workspaces"));
const AdminSystem = lazy(() => import("@/pages/Admin/System"));
const AdminLogs = lazy(() => import("@/pages/Admin/Logging"));
const GeneralChats = lazy(() => import("@/pages/GeneralSettings/Chats"));
const GeneralAppearance = lazy(
  () => import("@/pages/GeneralSettings/Appearance")
);
const GeneralApiKeys = lazy(() => import("@/pages/GeneralSettings/ApiKeys"));
const GeneralLLMPreference = lazy(
  () => import("@/pages/GeneralSettings/LLMPreference")
);
const GeneralTranscriptionPreference = lazy(
  () => import("@/pages/GeneralSettings/TranscriptionPreference")
);
const GeneralAudioPreference = lazy(
  () => import("@/pages/GeneralSettings/AudioPreference")
);
const GeneralEmbeddingPreference = lazy(
  () => import("@/pages/GeneralSettings/EmbeddingPreference")
);
const EmbeddingTextSplitterPreference = lazy(
  () => import("@/pages/GeneralSettings/EmbeddingTextSplitterPreference")
);
const GeneralVectorDatabase = lazy(
  () => import("@/pages/GeneralSettings/VectorDatabase")
);
const GeneralSecurity = lazy(() => import("@/pages/GeneralSettings/Security"));

const EmbedConfigSetup = lazy(
  () => import("@/pages/GeneralSettings/EmbedConfigs")
);
const EmbedChats = lazy(() => import("@/pages/GeneralSettings/EmbedChats"));
const PrivacyAndData = lazy(
  () => import("@/pages/GeneralSettings/PrivacyAndData")
);

export default function App() {
  const sidebarRef = useRef(null);
  const {
    showing: showingUpload,
    showModal: showUploadModal,
    hideModal: hideUploadModal,
  } = useUploadDatasetsModal();

  const [trainerSocket, setTrainerSocket] = useState<WebSocket | null>(null);
  // establish websocket with trainer
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/training/job/");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message: ", data.message);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setTrainerSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Suspense fallback={<div />}>
      <ContextWrapper>
        <LogoProvider>
          <div className="bg-main flex h-full">
            {showingUpload && <UploadDatasets hideModal={hideUploadModal} />}

            {!isMobile && (
              <div
                className={`SidebarContainer h-full flex flex-col items-center justify-between`}
                ref={sidebarRef}
              >
                <Sidebar />
              </div>
            )}
            <div className="MainContainer flex-1 flex flex-col">
              {!isMobile ? (
                <div className="Header">
                  <Header showUploadModal={showUploadModal} />
                </div>
              ) : (
                <div className="Header"></div>
              )}
              <div className={`MainBody flex-1 mr-4 mb-8 rounded-xl shadow`}>
                <Routes>
                  <Route
                    path="/"
                    element={<PrivateRoute Component={Dashboard} />}
                  />
                  <Route
                    path="/job/:jobId"
                    element={
                      <PrivateRoute
                        trainerSocket={trainerSocket}
                        Component={Dashboard}
                      />
                    }
                  />
                  <Route
                    path="/logs"
                    element={<PrivateRoute Component={DefaultChat} />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/accept-invite/:code" element={<InvitePage />} />

                  {/* Admin */}
                  <Route
                    path="/settings"
                    element={<AdminRoute Component={GeneralLLMPreference} />}
                  />
                  <Route
                    path="/settings/llm-preference"
                    element={<AdminRoute Component={GeneralLLMPreference} />}
                  />
                  <Route
                    path="/settings/transcription-preference"
                    element={
                      <AdminRoute Component={GeneralTranscriptionPreference} />
                    }
                  />
                  <Route
                    path="/settings/audio-preference"
                    element={<AdminRoute Component={GeneralAudioPreference} />}
                  />
                  <Route
                    path="/settings/embedding-preference"
                    element={
                      <AdminRoute Component={GeneralEmbeddingPreference} />
                    }
                  />
                  <Route
                    path="/settings/text-splitter-preference"
                    element={
                      <AdminRoute Component={EmbeddingTextSplitterPreference} />
                    }
                  />
                  <Route
                    path="/settings/vector-database"
                    element={<AdminRoute Component={GeneralVectorDatabase} />}
                  />
                  <Route
                    path="/settings/event-logs"
                    element={<AdminRoute Component={AdminLogs} />}
                  />
                  <Route
                    path="/settings/embed-config"
                    element={<AdminRoute Component={EmbedConfigSetup} />}
                  />
                  <Route
                    path="/settings/embed-chats"
                    element={<AdminRoute Component={EmbedChats} />}
                  />
                  {/* Manager */}
                  <Route
                    path="/settings/security"
                    element={<ManagerRoute Component={GeneralSecurity} />}
                  />
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
            </div>
            <ToastContainer />
          </div>
        </LogoProvider>
      </ContextWrapper>
    </Suspense>
  );
}
