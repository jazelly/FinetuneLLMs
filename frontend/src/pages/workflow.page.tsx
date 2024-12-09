import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import DashboardModel from '../models/dashboard';
import type { AllJobOptions } from '@/types/dashboard.type';

const WorkflowPage = () => {
  const [jobOptions, setJobOptions] = useState<AllJobOptions | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const { setPermalinks } = useContext(PermalinksContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Drag state management
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef(0);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const currentWidthRef = useRef(0);

  const initialLeftWidth = ((window.innerWidth - 42 - 16) * 2) / 3;
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const minWidthLeft = SIDEBAR_WIDTH + 240;

  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
        const resp = await DashboardModel.getJobOptions();
        setJobOptions(
          resp.success
            ? resp.data
            : {
                baseModels: [],
                trainingMethods: [],
                datasets: [],
                hyperparameters: {},
              }
        );
      } catch (error: any) {
        setError(error);
      }
    };

    fetchJobOptions();
  }, []);

  useEffect(() => {
    setPermalinks([PERMALINK_FINETUNE]);
  }, [setPermalinks]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartPosRef.current = e.clientX;
      currentWidthRef.current = leftWidth;
      document.body.style.cursor = 'col-resize';
      document.body.classList.add('select-none');
    },
    [leftWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const delta = e.clientX - dragStartPosRef.current;
      const newWidth = Math.max(
        minWidthLeft,
        Math.min(currentWidthRef.current + delta, window.innerWidth - 200)
      );

      // Use direct DOM manipulation for smooth resizing
      if (leftPanelRef.current) {
        leftPanelRef.current.style.width = `${newWidth}px`;
      }
    },
    [minWidthLeft]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.classList.remove('select-none');

      // Update React state once dragging is complete
      const delta = e.clientX - dragStartPosRef.current;
      const newWidth = Math.max(
        minWidthLeft,
        Math.min(currentWidthRef.current + delta, window.innerWidth - 200)
      );
      setLeftWidth(newWidth);
    },
    [minWidthLeft]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const toggleRightCollapse = () => {
    setIsRightCollapsed((prev) => {
      const newIsCollapsed = !prev;
      setLeftWidth(
        newIsCollapsed
          ? (containerRef.current?.offsetWidth ?? 0) - 8 - 12.5
          : initialLeftWidth
      );
      return newIsCollapsed;
    });
  };

  return (
    <div ref={containerRef} className="flex overflow-y-hidden h-full">
      <div
        ref={leftPanelRef}
        style={{
          width: `${leftWidth}px`,
          minWidth: `${minWidthLeft}px`,
          willChange: 'width',
        }}
        className="flex h-full bg-main-menu text-white"
      >
        <Workflow />
      </div>

      <div
        className={`relative w-1 flex items-center justify-center cursor-col-resize 
          hover:bg-blue-400 active:bg-blue-500 transition-colors
          ${isDraggingRef.current ? 'bg-blue-500' : 'bg-transparent'}`}
        onMouseDown={handleMouseDown}
      ></div>

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
