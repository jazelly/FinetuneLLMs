import React, { useContext, useState } from 'react';
import Dropdown from './Dropdown.component';
import { AllJobOptions, DatasetRemote } from '@/types/dashboard.type';
import { CaretCircleDoubleRight } from '@phosphor-icons/react';
import Job from '@/models/job.model';
import { useNavigate } from 'react-router-dom';
import { TrainerMessageMapContext } from '@/contexts/TrainerMessageMap.context';
import Scrollable from './reusable/Scrollable.component'; // Import the ScrollBar component
import Tip from './reusable/Tip.component';

export interface FinetunePanelProps {
  jobOptions: AllJobOptions | undefined;
  setJobOptions: any;
  runningJobId?: string;
}

const FinetunePanel = ({ jobOptions, setJobOptions }: FinetunePanelProps) => {
  const { sendMessage } = useContext(TrainerMessageMapContext);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [submitJobError, setSubmitJobError] = useState('');

  const [baseModel, setBaseModel] = useState('');
  const [trainingMethod, setTrainingMethod] = useState('');
  const [datasetJson, setDatasetJson] = useState<Record<string, any>>({});

  const navigate = useNavigate();

  const clearSubmitJobError = () => {
    if (submitJobError !== '') setSubmitJobError('');
  };

  const handleHyperparametersChange = (
    hyperparameters: AllJobOptions['hyperparameters']
  ) => {
    setJobOptions({
      ...jobOptions!,
      hyperparameters,
    });
  };

  // We cannot do strict typing for event or this handler
  // See issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508
  const handleHyperparametersStringChange = (event) => {
    console.log('event', event);
    const newHyper = event.updated_src;
    handleHyperparametersChange(newHyper);
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

    if (submitJobError) clearSubmitJobError();

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

    if (!sendMessage) return;
    console.log('send to ws', resp.data);
    sendMessage(
      JSON.stringify({
        type: 'command',
        message: 'submitted a job',
        data: {
          baseModel,
          trainingMethod,
          datasetName: datasetJson.name,
          hyperparameters: jobOptions.hyperparameters,
        },
      })
    );
    navigate(`/job/${resp.data.id}`, { state: { fresh: true } });

    return;
  };

  return (
    <Scrollable>
      {/* Wrap the content with ScrollBar */}
      <div className="flex flex-col px-4 py-3 h-full w-full">
        <div className="flex justify-between">
          <div className="text-lg font-semibold">Submit a finetuning job</div>
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
            <span className={`text-white font-semibold`}>Submit</span>
            <CaretCircleDoubleRight
              weight={submitHovered ? 'fill' : 'bold'}
              size={24}
              color="#ffffff"
            />
          </div>
        </div>
        {submitJobError !== '' && <Tip type="error" message={submitJobError} />}
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
    </Scrollable>
  );
};

export default FinetunePanel;
