import React, { useContext, useEffect, useRef, useState } from 'react';
import FinetunePanel from '@/components/FinetunePanel.component';
import DivResizeHandle from '@/components/DivResizeHandle.component';
import { ResizableBox } from 'react-resizable';
import type { ResizeHandle } from 'react-resizable';
import 'react-resizable/css/styles.css';
import DashboardModel from '../models/dashboard';
import type { AllJobOptions, JobDetail } from '@/types/dashboard.type';
import InferencePanel from '@/components/InferencePanel.component';
import { PermalinksContext } from '@/contexts/Permalinks.context';
import {
  BOTTOM_GAP,
  DEFAULT_CHAT_MESSAGES,
  HEADER_HEIGHT,
  PERMALINK_FINETUNE,
  RIGHT_GAP,
  SIDEBAR_WIDTH,
} from '@/utils/constants';
import ChatContainer from '@/components/Chat/ChatContainer.component';
import Workflow from '@/components/workflow';

const WorkflowPage = () => {
  const [jobOptions, setJobOptions] = useState<AllJobOptions | undefined>(
    undefined
  );

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
    setPermalinks([PERMALINK_FINETUNE]);
    return;
  }, []);

  const initialLeftWidth = ((window.innerWidth - 42 - 16) * 2) / 3; // 2/3 width for the left panel

  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);

  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const [isHoldingHandle, setIsHoldingHandle] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftResize = (event, { size }) => {
    setLeftWidth(size.width);
  };

  // TODO: lift it to global so it can catch all mouse up
  const handleMouseUp = (e, cb) => {
    setIsHoldingHandle(false);
    if (cb) cb(e);
  };

  const containerHeight = window.innerHeight - BOTTOM_GAP - 64;
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

  return (
    <div
      ref={containerRef}
      onMouseUp={(e) => handleMouseUp(e, undefined)}
      className="flex overflow-y-hidden h-full"
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
        className="flex h-full bg-main-menu text-white"
      >
        <Workflow />
      </ResizableBox>
      {!isRightCollapsed && (
        <div className="flex-1 bg-main-workspace">
          <ChatContainer
            chatMessages={[...DEFAULT_CHAT_MESSAGES]}
            chatDisabled={true}
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
