import type { JobDetail } from '@/types/dashboard.type';
import React from 'react';
import ChatContainer from './Chat/ChatContainer.component';

export interface InferencePanelProps {
  model?: string;
  jobDetail?: JobDetail | null;
  jobDetailLoading: boolean;
}

const InferencePanel = ({
  model,
  jobDetail,
  jobDetailLoading,
}: InferencePanelProps) => {
  if (jobDetail)
    return (
      <div className="flex items-center justify-center h-full">
        <span>You can now interact with {jobDetail.baseModel}</span>
      </div>
    );

  if (!model)
    return (
      <div className="h-full">
        <ChatContainer />
      </div>
    );

  return (
    <div className={`h-full`}>
      <ChatContainer />
    </div>
  );
};

export default InferencePanel;
