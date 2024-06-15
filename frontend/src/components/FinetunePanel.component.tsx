import React, { useState } from 'react';
import Dropdown from './Dropdown.component';
import { AllJobOptions, IDataset } from '@/models/types/dashboard';
import { CaretCircleDoubleRight } from '@phosphor-icons/react';
import Job from '@/models/job.model';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '@/hooks/useWebSocket';

export interface FinetunePanelProps {
  jobOptions: AllJobOptions | undefined;
  runningJobId?: string;
}

const FinetunePanel = ({ jobOptions, runningJobId }: FinetunePanelProps) => {
  const { trainerSocket, sendMessageToTrainer } = useWebSocket();
  const [submitHovered, setSubmitHovered] = useState(false);
  const [submitJobError, setSubmitJobError] = useState('');

  const [baseModel, setBaseModel] = useState('');
  const [trainingMethod, setTrainingMethod] = useState('');
  const [datasetJson, setDatasetJson] = useState<Record<string, any>>({});

  const navigate = useNavigate();

  const clearSubmitJobError = () => {
    if (submitJobError !== '') setSubmitJobError('');
  };

  const handleSubmitJob = async () => {
    if (!jobOptions) return;

    // validate selections
    if (!baseModel || !trainingMethod || !datasetJson.name) {
      setSubmitJobError(
        'Must select a combination of mode, method and dataset'
      );
      return;
    }

    clearSubmitJobError();

    const resp = await Job.submitJob({
      baseModel,
      trainingMethod,
      datasetName: datasetJson.name,
      hyperparameters: jobOptions.hyperparameters,
    });

    console.log('resp', resp);

    if (!resp.success || (resp.success === true && !resp.data.id)) {
      setSubmitJobError('An error occurred when submitting the job');
      return;
    }

    console.log('send to ws', resp.data);
    sendMessageToTrainer(
      JSON.stringify({
        type: 'start',
        message: 'submitted a job',
        data: {
          baseModel,
          trainingMethod,
          datasetName: datasetJson.name,
          hyperparameters: jobOptions.hyperparameters,
        },
      })
    );
    navigate(`/job/${resp.data.id}`, { replace: true });

    return;
  };

  return (
    <div className="flex flex-col item-start bg-white border-b-2 border-r-2 px-4 py-3 gap-y-4 h-full">
      <div className="flex justify-between">
        <div className="text-lg font-semibold text-main-title">
          Submit a finetuning job
        </div>
        <div
          onMouseEnter={() => {
            setSubmitHovered(true);
          }}
          onMouseLeave={() => {
            setSubmitHovered(false);
          }}
          className="flex items-center justify-center gap-x-2 w-32 lg:w-48 transition-all duration-300 p-2 rounded-lg shadow-sm border border-transparent cursor-pointer"
          aria-label="Upload your datasets"
          onClick={handleSubmitJob}
          style={{ backgroundColor: '#0aa8ff' }}
        >
          <span className={`text-white`}>Submit</span>
          <CaretCircleDoubleRight
            weight={submitHovered ? 'fill' : 'bold'}
            size={24}
            color="#ffffff"
          />
        </div>
      </div>
      {submitJobError !== '' && (
        <div className="text-red-500 text-sm italic">{submitJobError}</div>
      )}
      <Dropdown
        placeholder="Base model"
        options={jobOptions?.baseModels ?? []}
        onSelect={setBaseModel}
        label="Base model"
        disabled={!jobOptions}
      />
      <Dropdown
        placeholder="Training method"
        options={jobOptions?.trainingMethods?.map((m) => m.name) ?? []}
        onSelect={setTrainingMethod}
        label="Training method"
        disabled={!jobOptions}
      />
      <Dropdown
        placeholder="Dataset"
        options={jobOptions?.datasets?.map((d) => d.name) ?? []}
        onSelect={(selectedDatasetName) => {
          const theDataset = jobOptions?.datasets?.find(
            (dataset) => dataset.name === selectedDatasetName
          );
          if (theDataset) setDatasetJson(theDataset);
          else if (Object.keys(datasetJson).length !== 0) setDatasetJson({});
        }}
        label="Dataset"
        disabled={!jobOptions}
      />
    </div>
  );
};

export default FinetunePanel;
