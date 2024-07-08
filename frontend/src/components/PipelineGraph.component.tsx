import { TrainerMessageMapContext } from '@/contexts/TrainerMessageMap.context';
import Job from '@/models/job.model';
import { JobDetail } from '@/types/dashboard.type';
import { calculateTimeDifference } from '@/utils/misc';
import { CheckCircle } from '@phosphor-icons/react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import StatusIcon from './reusable/StatusIcon.component';

const PipelineGraph = ({ jobDetail }: { jobDetail: JobDetail }) => {
  const id = jobDetail.id;
  const status = jobDetail.status;

  console.log(jobDetail);

  const { sendMessage } = useContext(TrainerMessageMapContext);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const handleResubmit = async () => {
    setSubmitting(true);

    const jobDetailParams = {
      baseModel: jobDetail.baseModel,
      trainingMethod: jobDetail.trainingMethod,
      datasetName: jobDetail.datasetName,
      hyperparameters: jobDetail.hyperparameters,
    };
    const resp = await Job.submitJob(jobDetailParams);

    console.log('resp', resp);

    if (!resp.success || (resp.success === true && !resp.data.id)) {
      return;
    }

    if (!sendMessage) return;
    console.log('send to ws', resp.data);
    sendMessage(
      JSON.stringify({
        type: 'command',
        message: 'submitted a job',
        data: jobDetailParams,
      })
    );
    navigate(`/job/${resp.data.id}`, {
      state: { fresh: true, jobId: resp.data.id },
    });
    setSubmitting(false);
    return;
  };

  const createdDate = new Date(jobDetail.createdAt);
  const lastUpdatedDate = new Date(jobDetail.lastUpdatedAt);
  const currentDate = new Date();

  const usedTime = calculateTimeDifference(createdDate, lastUpdatedDate);
  const passedTime = calculateTimeDifference(createdDate, currentDate);
  let usedTimeString = '';
  if (usedTime.diffInHours > 0) usedTimeString += `${usedTime.diffInHours} h `;
  if (usedTime.diffInMinutes % 60 > 0)
    usedTimeString += `${usedTime.diffInMinutes % 60} min `;
  if (usedTime.diffInSeconds % 60 > 0)
    usedTimeString += `${usedTime.diffInSeconds % 60} sec`;

  if (usedTimeString === '') usedTimeString = `Didn't start`;

  const passedTimeString =
    passedTime.diffInDays > 0
      ? `${passedTime.diffInDays} days ago`
      : passedTime.diffInHours > 0
        ? `${passedTime.diffInHours} hours ago`
        : passedTime.diffInMinutes > 0
          ? `${passedTime.diffInSeconds} seconds ago`
          : 'Just submitted';

  return (
    <div className="shadow-md w-full h-full flex flex-col overflow-y-auto">
      <div
        className={`flex items-center justify-between ${status === 'paused' ? 'bg-[#626F86]' : status === 'failed' ? 'bg-[#c9372c] ' : 'bg-[#22a06b]'}  px-3 py-2 text-white`}
      >
        <div className="flex items-center">
          <StatusIcon status={status} size={32} weight="fill" />
          <span className="text-xl ml-2">#{id}</span>
        </div>
        <button
          className="bg-gray-600 text-xs px-2 py-1 rounded"
          onClick={handleResubmit}
        >
          Rerun
        </button>
      </div>
      <div className="bg-gray-200 p-4 flex-1">
        <div className="text-sm mb-4">
          <div className="text-gray-500 mt-2">
            {usedTimeString} • {passedTimeString}
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pipeline</h3>
          <div className="flex space-x-2">
            <div
              className="flex gap-x-2 items-center justify-between"
              data-tooltip-content="View Configurations"
              data-tooltip-id="view-configurations"
            >
              <button
                onClick={() => {}}
                className="flex flex-grow h-[44px] rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <Tooltip
                id="view-configurations"
                place="bottom"
                delayShow={200}
                className="tooltip z-99 text-sm"
              />
            </div>
          </div>
        </div>
        {[
          'type-check',
          'lint',
          'Run Helm Lint',
          'Run Terraform Docs Check',
          'unit-tests',
          'validate-sinecloud-api-workflow-types',
          'build',
          'publish-openapi',
        ].map((step, index) => (
          <div className="flex items-center mb-2" key={index}>
            <CheckCircle
              size={26}
              color={
                status === 'paused'
                  ? '#626F86'
                  : status === 'failed'
                    ? '#c9372c '
                    : '#22a06b'
              }
              weight="fill"
            />
            <span className="text-sm ml-2">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineGraph;
