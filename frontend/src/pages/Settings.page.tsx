import SettingsSidebar from '@/components/SettingsSidebar.component';
import React, { lazy, useEffect, useState } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import { AdminRoute } from '@/components/PrivateRoute';

import { ManagerRoute } from '@/components/ManagerRoute';
import SettingsContainer from '@/components/SettingsContainer.component';

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

export default function Settings() {
  const match = useMatch('/settings');

  console.log('match', match);
  return (
    <div className="w-full h-full overflow-hidden flex">
      <SettingsSidebar />

      <Routes>
        <Route path="/" element={<SettingsContainer />}>
          <Route path="llm" element={<GeneralLLMPreference />} />
          <Route path="invites" element={<AdminInvites />} />
          <Route path="users" element={<AdminUsers />} />
          <Route
            path="privacy"
            element={<AdminRoute Component={PrivacyAndData} />}
          />
          <Route
            path="appearance"
            element={<ManagerRoute Component={GeneralAppearance} />}
          />
          <Route
            path="api-keys"
            element={<AdminRoute Component={GeneralApiKeys} />}
          />
          <Route
            path="workspace-chats"
            element={<ManagerRoute Component={GeneralChats} />}
          />
          <Route
            path="system-preferences"
            element={<ManagerRoute Component={AdminSystem} />}
          />
          <Route
            path="workspaces"
            element={<ManagerRoute Component={AdminWorkspaces} />}
          />
        </Route>
      </Routes>
    </div>
  );
}
