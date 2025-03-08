import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PermalinksContext } from '@/contexts/Permalinks.context';
import { PERMALINK_FINETUNE, SIDEBAR_WIDTH } from '@/utils/constants';
import Workflow from '@/components/workflow';
import NodeConfigPanel from '@/components/workflow/NodeConfigPanel';
import DashboardModel from '../models/dashboard';
import type { AllJobOptions } from '@/types/dashboard.type';

// Create a context to share the selected node between components
export const SelectedNodeContext = React.createContext<{
  selectedNode: any;
  setSelectedNode: React.Dispatch<React.SetStateAction<any>>;
}>({
  selectedNode: null,
  setSelectedNode: () => {},
});

const WorkflowPage = () => {
  const [jobOptions, setJobOptions] = useState<AllJobOptions | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const { setPermalinks } = useContext(PermalinksContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // State to track the selected node
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Drag state management
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef(0);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const currentWidthRef = useRef(0);

  const initialLeftWidth = ((window.innerWidth - 42 - 16) * 2) / 3;
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const minWidthLeft = SIDEBAR_WIDTH + 240;

  // Store the previous width before collapsing
  const [previousWidth, setPreviousWidth] = useState(initialLeftWidth);

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
      // Prevent resizing when the panel is collapsed
      if (isRightCollapsed) return;

      e.preventDefault();
      isDraggingRef.current = true;
      dragStartPosRef.current = e.clientX;
      currentWidthRef.current = leftWidth;
      document.body.style.cursor = 'col-resize';
      document.body.classList.add('select-none');
    },
    [leftWidth, isRightCollapsed]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || isRightCollapsed) return;

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
    [minWidthLeft, isRightCollapsed]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || isRightCollapsed) return;

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
    [minWidthLeft, isRightCollapsed]
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

      if (newIsCollapsed) {
        // Store the current width before collapsing
        setPreviousWidth(leftWidth);

        // Expand the left panel to fill the container
        setLeftWidth((containerRef.current?.offsetWidth ?? 0) - 8 - 12.5);
      } else {
        // Restore the previous width when expanding
        setLeftWidth(previousWidth);
      }

      return newIsCollapsed;
    });
  };

  // Handle panel close
  const handlePanelClose = () => {
    // Collapse the right panel
    if (!isRightCollapsed) {
      toggleRightCollapse();
    }
  };

  // Calculate the right panel width
  const rightPanelWidth = isRightCollapsed
    ? 0
    : window.innerWidth - leftWidth - 20;

  // Expose the context to the window for access from other components
  useEffect(() => {
    (window as any).selectedNodeContext = { selectedNode, setSelectedNode };

    return () => {
      delete (window as any).selectedNodeContext;
    };
  }, [selectedNode, setSelectedNode]);

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      <div
        ref={containerRef}
        className="flex overflow-y-hidden h-full bg-gray-900 text-gray-100"
      >
        <div
          ref={leftPanelRef}
          style={{
            width: `${leftWidth}px`,
            minWidth: `${minWidthLeft}px`,
            willChange: 'width',
          }}
          className="flex h-full bg-gray-800 text-gray-100 shadow-md"
        >
          <Workflow />
        </div>

        <div
          className={`relative w-1 flex items-center justify-center
            ${
              !isRightCollapsed
                ? 'cursor-col-resize hover:bg-blue-600 active:bg-blue-700'
                : 'bg-gray-700'
            } 
            transition-colors
            ${isDraggingRef.current ? 'bg-blue-700' : ''}`}
          onMouseDown={!isRightCollapsed ? handleMouseDown : undefined}
        >
          {isRightCollapsed && (
            <button
              onClick={toggleRightCollapse}
              className="absolute right-[-12px] bg-gray-700 hover:bg-gray-600 rounded-r-md p-1 shadow-md transition-all duration-200 hover:scale-110"
              title="Expand panel"
            >
              <span className="text-xl text-gray-300">›</span>
            </button>
          )}
        </div>

        {!isRightCollapsed && (
          <div className="flex-1 bg-gray-800 relative shadow-md">
            <button
              onClick={toggleRightCollapse}
              className="absolute left-[-12px] top-4 bg-gray-700 hover:bg-gray-600 rounded-l-md p-1 z-10 shadow-md transition-all duration-200 hover:scale-110"
              title="Collapse panel"
            >
              <span className="text-xl text-gray-300">‹</span>
            </button>
            <NodeConfigPanel
              width={rightPanelWidth}
              onClose={handlePanelClose}
            />
          </div>
        )}
      </div>
    </SelectedNodeContext.Provider>
  );
};

export default WorkflowPage;
