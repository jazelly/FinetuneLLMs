'use client';

import React, { useEffect, useRef, useState, createContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { WorkflowReactFlowProvider } from '@/src/components/workflow';
import ConfiguredNodePanel from '@/src/components/workflow/NodePanelWrapper';
import { useWorkflow, useAutoSaveWorkflow } from '@/src/components/workflow/hooks/workflow.hooks';
import { formatDistanceToNow } from 'date-fns';
import { FloppyDisk } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { WorkflowContextProvider } from '@/src/components/workflow/context';

// Dynamically import the workflow container to avoid SSR issues
const WorkflowContainer = dynamic(
  () => import('@/src/components/workflow'), 
  { ssr: false }
);

const WorkflowPage = () => {
  const params = useParams();
  const workflowId = params?.id as string;
  const { fetchWorkflow, updateWorkflow } = useWorkflow();
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
    <WorkflowContextProvider workflowId={workflowId}>
      <div className="relative w-full h-full bg-gray-50">
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
            {saveStatus === 'saved' && formattedLastSaved ? `Last time saved at ${formattedLastSaved}` : ''}
            {saveStatus === 'error' && 'Failed to save'}
            {saveStatus === 'idle' && 'No changes'}
          </span>
        </div>

        {/* Main workflow area - full width and height */}
        
        <WorkflowReactFlowProvider>
          {workflowData && (
            <WorkflowContainer 
              workflowId={workflowId}
              initialData={workflowData}
            />
          )}
        </WorkflowReactFlowProvider>
        
        
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
    </WorkflowContextProvider>
  );
};

export default WorkflowPage;
