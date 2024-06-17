import type { AllJobOptions, JobDetail } from '@/types/dashboard.type';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner.component';
import Job from '@/models/job.model';
import useWebSocket from '@/hooks/useWebSocket';

import type { TrainerPayload, TrainerResponseWS } from '@/types/dashboard.type';

export interface DetailPanelProps {
  jobDetail: JobDetail | undefined;
  jobDetailLoading: boolean;
}

const DetailPanel = ({ jobDetail, jobDetailLoading }: DetailPanelProps) => {
  const { messageMap, sendMessage } = useWebSocket<
    TrainerPayload,
    TrainerResponseWS
  >();
  const [error, setError] = useState('');

  if (jobDetailLoading) return <LoadingSpinner />;

  const messageList = jobDetail?.taskId
    ? messageMap[jobDetail.taskId] ?? []
    : [];

  console.log('messageMap', messageMap);

  return (
    <div
      className={`flex flex-col item-start bg-main-gradient text-white py-2 gap-y-4 h-full w-full`}
    >
      <div className="flex justify-center item-center">
        {jobDetail ? `Job is ${jobDetail.status}` : `No job is running`}
      </div>
    </div>
  );
};

export default DetailPanel;
