import type { JobDetail } from '@/types/dashboard.type';
import React from 'react';

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
      <div className="flex item-center justify-center bg-main-gradient text-white h-full">
        You can now interact with {jobDetail.baseModel}: trained by{' '}
        {jobDetail.datasetName}
      </div>
    );

  if (!model)
    return (
      <div className="flex item-center justify-center bg-main-gradient text-white h-full">
        Choose a model to start
      </div>
    );

  return (
    <div
      className={`flex flex-col item-start bg-main-gradient text-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full w-full`}
    >
      <div className="flex">{model}</div>
    </div>
  );
};

export default InferencePanel;