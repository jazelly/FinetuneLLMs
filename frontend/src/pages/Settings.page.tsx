import SettingsSidebar from '@/components/SettingsSidebar.component';
import React, { lazy, useEffect, useState } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';

import SettingsContainer from '@/components/SettingsContainer.component';

const Privacy = lazy(() => import('@/pages/Privacy.page'));

export default function Settings() {
  const match = useMatch('/settings');

  console.log('match', match);
  return (
    <div className="w-full h-full overflow-hidden bg-main-workspace bg-opacity-80 flex">
      <SettingsSidebar />

      <div className="p-6 max-md:p-3 flex-1">
        <Routes>
          <Route path="/" element={<SettingsContainer />}>
            <Route path="privacy" element={<Privacy />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
