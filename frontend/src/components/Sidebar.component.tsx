import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  Plus,
  Wrench,
  Circuitry,
  AlignLeft,
  FlipVertical,
  FileArrowUp,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import paths from '@/utils/paths';
import { Tooltip } from 'react-tooltip';
import UploadDatasets, {
  useUploadDatasetsModal,
} from './Modals/UploadDatasets';

export default function Sidebar() {
  const navigate = useNavigate();

  const isNewingJob = useMatch('/');
  const isViewingPipelines = useMatch('/pipelines');
  const isViewingJob = useMatch('/job/:jobId');
  const isViewingSettings = useMatch('/settings/*');

  const {
    showing: showingUpload,
    showModal: showUploadModal,
    hideModal: hideUploadModal,
  } = useUploadDatasetsModal();

  const [uploadHover, setUploadHover] = useState<boolean>(false);

  const handleNavigate = (path) => {
    switch (path) {
      case '/':
        navigate('/');
        break;
      case 'pipelines':
        navigate(paths.pipelines);
        break;
      case 'settings':
        navigate('/settings/privacy');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="flex flex-col items-center h-full pt-2 pb-4 px-3">
      {showingUpload && <UploadDatasets hideModal={hideUploadModal} />}
      <Link
        to={paths.home}
        className="flex shrink-0 w-[40px] items-center justify-center"
        aria-label="Home"
      >
        <FlipVertical size={36} color="#f0f2f4" weight="fill" />
      </Link>

      <div className="overflow-hidden mt-5 flex-grow  flex justify-between items-center flex-col">
        <div className="flex flex-col min-w-[24px] gap-y-3">
          <div
            className="flex gap-x-2 items-center justify-between"
            data-tooltip-content="Finetune"
            data-tooltip-id="finetune"
          >
            <button
              onClick={() => {
                handleNavigate('/');
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <Circuitry
                color={isNewingJob ? '#587DCA' : '#7C8690'}
                size={30}
                weight="fill"
              />
            </button>
            <Tooltip
              id="finetune"
              place="right"
              delayShow={200}
              className="tooltip z-99"
            />
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <button
              onClick={() => {
                handleNavigate('pipelines');
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <AlignLeft
                size={30}
                color={isViewingPipelines ? '#4A7AD6' : '#7C8690'}
                weight="fill"
              />
            </button>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <button
              onClick={() => {
                handleNavigate('settings');
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <Wrench
                size={30}
                color={isViewingSettings ? '#4A7AD6' : '#7C8690'}
                weight="fill"
              />
            </button>
          </div>
        </div>
        <div
          onMouseEnter={() => {
            setUploadHover(true);
          }}
          onMouseLeave={() => {
            setUploadHover(false);
          }}
          className={`transition-all duration-300 flex justify-center items-center rounded-lg shadow-sm cursor-pointer`}
          aria-label="Upload your datasets"
          onClick={showUploadModal}
        >
          <FileArrowUp
            weight={uploadHover || showingUpload ? 'fill' : 'bold'}
            size={30}
            color={uploadHover || showingUpload ? '#fff' : '#737b85'}
          />
        </div>
      </div>
    </div>
  );
}
