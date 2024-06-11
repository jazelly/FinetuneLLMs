import type { AllJobOptions, IJobDetail } from "@/models/types/dashboard";
import React, { useEffect, useState } from "react";
import JSONView from "react-json-view";
import LoadingSpinner from "./LoadingSpinner.component";
import Job from "@/models/job.model";

export interface DetailPanelProps {
  jobId: string;
}

const DetailPanel = ({ jobId }: DetailPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  return (
    <div
      className={`flex flex-col item-start bg-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full`}
    >
      <div className="flex">Job logs</div>

      <div>{jobDetails?.status}</div>
    </div>
  );
};

export default DetailPanel;
