import React, { lazy, Suspense, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isMobile } from 'react-device-detect';
import { LogoProvider } from '@/contexts/LogoContext';
import { PermalinksProvider } from '@/contexts/Permalinks.context';
import Sidebar from '@/components/Sidebar.component';
import Header from './components/Header.component';
import { TrainerMessageMapProvider } from './contexts/TrainerMessageMap.context';
import Settings from './pages/Settings.page';
import NotFound from './pages/404.page';
import paths from './utils/paths';
import { InferenceMessageListProvider } from './contexts/InferenceMessageMap.context';
import Chat from './pages/Chat.page';
import I18N from './i18n/context';
import Pipelines from '@/pages/Pipelines.page';
import Pipeline from '@/pages/Pipeline.page';
import WorkflowPage from '@/pages/workflow.page';

dayjs.extend(relativeTime);
export default function App() {
  const sidebarRef = useRef(null);

  return (
    <Suspense fallback={<div />}>
      <I18N locale="en">
        <LogoProvider>
          <PermalinksProvider>
            <InferenceMessageListProvider>
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
                      <Route path="/" element={<WorkflowPage />} />
                      <Route path="/job/:jobId" element={<Pipeline />} />
                      <Route path={paths.pipelines} element={<Pipelines />} />
                      <Route path="/chat/*" element={<Chat />} />
                      <Route path="/settings/*" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <ToastContainer />
                </div>
              </TrainerMessageMapProvider>
            </InferenceMessageListProvider>
          </PermalinksProvider>
        </LogoProvider>
      </I18N>
    </Suspense>
  );
}
