import React, { useContext, useEffect, useRef, useState } from 'react';
import FinetunePanel from '@/components/FinetunePanel.component';
import DivResizeHandle from '@/components/DivResizeHandle.component';
import { ResizableBox } from 'react-resizable';
import type { ResizeHandle } from 'react-resizable';
import 'react-resizable/css/styles.css';
import DashboardModel from '../models/dashboard';
import type { AllJobOptions, JobDetail } from '@/types/dashboard.type';
import { useParams } from 'react-router-dom';
import DetailPanel from '@/components/DetailPanel.component';
import Job from '@/models/job.model';
import InferencePanel from '@/components/InferencePanel.component';
import { PermalinksContext } from '@/contexts/Permalinks.context';
import {
  BOTTOM_GAP,
  HEADER_HEIGHT,
  PERMALINK_DASHBOARD,
  RIGHT_GAP,
  SIDEBAR_WIDTH,
} from '@/utils/constants';
import { TrainerMessageMapProvider } from '@/contexts/TrainerMessageMap.context';

const MIN_BOTTOM_HEIGHT = 100;

const Dashboard = () => {
  const [jobOptions, setJobOptions] = useState<AllJobOptions | undefined>(
    undefined
  );

  const [jobDetail, setJobDetail] = useState<JobDetail | undefined>(undefined);

  const [jobDetailLoading, setJobDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { setPermalinks } = useContext(PermalinksContext);

  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
        const resp = await DashboardModel.getJobOptions();
        if (!resp.success) {
          setJobOptions({
            baseModels: [],
            trainingMethods: [],
            datasets: [],
            hyperparameters: {},
          });
        } else {
          setJobOptions(resp.data);
        }
      } catch (error: any) {
        setError(error);
      }
    };

    fetchJobOptions();
  }, []);

  useEffect(() => {
    setPermalinks([PERMALINK_DASHBOARD]);
    return;
  }, []);

  const initialLeftWidth = ((window.innerWidth - 42 - 16) * 1) / 3; // 1/3 width for the left panel
  const initialTopHeight = ((window.innerHeight - 32 - 64) * 2) / 3; // 32 is the bottom gap, 64 is the top gap

  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [topHeight, setTopHeight] = useState(initialTopHeight);

  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);

  const [isHoldingHandle, setIsHoldingHandle] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftResize = (event, { size }) => {
    setLeftWidth(size.width);
  };

  const handleTopResize = (event, { size }) => {
    setTopHeight(size.height);
  };

  // TODO: lift it to global so it can catch all mouse up
  const handleMouseUp = (e, cb) => {
    setIsHoldingHandle(false);
    if (cb) cb(e);
  };

  const containerHeight = window.innerHeight - BOTTOM_GAP - 64;
  const minHeightTop = HEADER_HEIGHT + 350;
  const maxHeightTop = containerHeight - MIN_BOTTOM_HEIGHT;
  const minWidthLeft = SIDEBAR_WIDTH + 240;
  const maxWidthLeft = window.innerWidth - RIGHT_GAP - 330; // 330 is the min width of detail panel

  const toggleRightCollapse = () => {
    if (isRightCollapsed) {
      setLeftWidth(initialLeftWidth); // TODO: use snapshot of last time left width
    } else {
      setLeftWidth(containerRef.current!.offsetWidth - 8 - 12.5);
    }
    setIsRightCollapsed(!isRightCollapsed);
  };

  const toggleBottomCollapse = () => {
    if (isBottomCollapsed) {
      setTopHeight(initialTopHeight);
    } else {
      setTopHeight(containerRef.current!.offsetHeight);
    }
    setIsBottomCollapsed(!isBottomCollapsed);
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={(e) => handleMouseUp(e, undefined)}
      className="flex h-full"
    >
      <ResizableBox
        width={leftWidth}
        height={containerRef.current?.offsetHeight ?? containerHeight}
        axis="x"
        resizeHandles={isRightCollapsed ? [] : ['e']}
        handle={(handleAxis: ResizeHandle, ref) => (
          <DivResizeHandle
            className={`handle-${handleAxis} div-handle div-handle-drag-horizontal`}
            isHoldingHandle={isHoldingHandle}
            setIsHoldingHandle={setIsHoldingHandle}
            handleMouseUp={(e, cb) => handleMouseUp(e, cb)}
            innerRef={ref}
          />
        )}
        onResize={handleLeftResize}
        minConstraints={[minWidthLeft, Infinity]} // width and height
        maxConstraints={[maxWidthLeft, Infinity]}
        className="flex h-full"
      >
        <FinetunePanel jobOptions={jobOptions} setJobOptions={setJobOptions} />
      </ResizableBox>
      {!isRightCollapsed && (
        <div className="flex-1 flex flex-col h-full">
          <InferencePanel
            jobDetail={jobDetail}
            jobDetailLoading={jobDetailLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
