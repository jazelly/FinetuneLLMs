'use client';

import React from 'react';
import AppLayout from './app-layout';
import WorkflowPage from '@/src/pages/workflow.page';

export default function Home() {
  return (
    <AppLayout>
      <WorkflowPage />
    </AppLayout>
  );
}
