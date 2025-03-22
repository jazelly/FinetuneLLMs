'use client';

import React, { useEffect, useRef, useState, createContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { WorkflowReactFlowProvider } from '@/src/components/workflow';
import WorkflowContainer from '@/src/components/workflow';
import ConfiguredNodePanel from '@/src/components/workflow/NodePanelWrapper';
import { useWorkflow, useAutoSaveWorkflow } from '@/src/components/workflow/hooks/workflow.hooks';
import { formatDistanceToNow } from 'date-fns';
import { FloppyDisk } from '@phosphor-icons/react';

// Create context to share selected node state across components
export const SelectedNodeContext = createContext({
  selectedNode: null,
  setSelectedNode: (node: any) => {},
});

const WorkflowPage = () => {
  const params = useParams();
  const workflowId = params?.id as string;
  const { fetchWorkflow } = useWorkflow();
  const { saveStatus, lastSaved, saveWorkflow } = useAutoSaveWorkflow(workflowId);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // State for workflow data
  const [workflowData, setWorkflowData] = useState<any>(null);
  
  // State to track the selected node
  const [selectedNode, setSelectedNode] = useState(null);
  
  // State to track if the panel is open
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Use state for window dimensions with initial values
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Load workflow data
  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflowId) {
        try {
          const data = await fetchWorkflow(workflowId);
          if (data) {
            setWorkflowData(data);
          }
        } catch (err) {
          console.error('Error loading workflow:', err);
          setError('Failed to load workflow');
        }
      }
    };

    loadWorkflow();
  }, [workflowId, fetchWorkflow]);

  // Function to handle workflow changes
  const handleWorkflowChange = useCallback((data) => {
    saveWorkflow(data);
  }, [saveWorkflow]);

  // Update window dimensions on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Set initial dimensions
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Calculate panel width
  const panelWidth = 320;
  
  // Handle panel close
  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  // Handle click away from panel
  const handleClickAway = useCallback((e: MouseEvent) => {
    if (isPanelOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
      handlePanelClose();
    }
  }, [isPanelOpen]);
  
  // Set up click away listener
  useEffect(() => {
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickAway);
    } else {
      document.removeEventListener('mousedown', handleClickAway);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [isPanelOpen, handleClickAway]);
  
  // When a node is selected, open the panel
  useEffect(() => {
    if (selectedNode) {
      setIsPanelOpen(true);
    }
  }, [selectedNode]);

  // Format last saved time
  const formattedLastSaved = lastSaved
    ? formatDistanceToNow(lastSaved, { addSuffix: true })
    : null;

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      <div className="relative w-full h-screen bg-gray-50">
        {/* Status indicator */}
        <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-sm px-4 py-2 flex items-center gap-2 text-sm">
          <FloppyDisk size={18} weight="fill" className={`
            ${saveStatus === 'saving' ? 'text-yellow-500 animate-pulse' : ''}
            ${saveStatus === 'saved' ? 'text-green-500' : ''}
            ${saveStatus === 'error' ? 'text-red-500' : ''}
            ${saveStatus === 'idle' ? 'text-gray-400' : ''}
          `} />
          <span>
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && formattedLastSaved ? `Saved ${formattedLastSaved}` : 'Ready to save'}
            {saveStatus === 'error' && 'Failed to save'}
            {saveStatus === 'idle' && 'No changes'}
          </span>
        </div>

        {/* Main workflow area - full width and height */}
        <div className="w-full h-full">
          <WorkflowReactFlowProvider>
            {workflowData && (
              <WorkflowContainer 
                nodes={[]}
                edges={[]}
                workflowId={workflowId}
                initialData={workflowData}
                onWorkflowChange={handleWorkflowChange}
              />
            )}
          </WorkflowReactFlowProvider>
        </div>
        
        {/* Floating Node configuration panel */}
        {isPanelOpen && (
          <div 
            ref={panelRef}
            className="absolute right-4 top-4 bottom-4 transition-all duration-300 ease-in-out z-10"
            style={{ 
              width: `${panelWidth}px`,
              animation: 'slide-in 0.3s ease-out forwards',
            }}
          >
            <ConfiguredNodePanel 
              width={panelWidth} 
              onClose={handlePanelClose} 
            />
          </div>
        )}

        {/* Add CSS animation for panel */}
        <style jsx>{`
          @keyframes slide-in {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </SelectedNodeContext.Provider>
  );
};

export default WorkflowPage;
