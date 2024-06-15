import type { AllJobOptions, IJobDetail } from '@/models/types/dashboard';
import React, { useEffect, useState } from 'react';
import JSONView from 'react-json-view';
import LoadingSpinner from './LoadingSpinner.component';
import Job from '@/models/job.model';
import useWebSocket, { TrainerResponseWS } from '@/hooks/useWebSocket';

export interface DetailPanelProps {
  jobId: string;
}

const DetailPanel = ({ jobId }: DetailPanelProps) => {
  const { trainerSocket, messages, sendMessageToTrainer } = useWebSocket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobDetails, setJobDetails] = useState<IJobDetail | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      setLoading(true);

      try {
        const resp = await Job.getJobDetails(jobId);
        if (!resp.success) {
          setError(resp.error);
        } else {
          setJobDetails(resp.data);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, []);

  if (loading) return <LoadingSpinner />;

  let messageList: Array<TrainerResponseWS> = [];
  if (jobDetails?.taskId) {
    messageList = messages[jobDetails.taskId];
  }

  return (
    <div
      className={`flex flex-col item-start bg-main-gradient text-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full`}
    >
      <div className="flex">Job logs</div>
    </div>
  );
};

export default DetailPanel;
