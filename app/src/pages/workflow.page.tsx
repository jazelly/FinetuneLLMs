'use client';

import React, { useEffect, useRef, useState } from 'react';
import Workflow from '@/src/components/workflow';
import NodeConfigPanel from '@/src/components/workflow/NodeConfigPanel';
import { CaretLeft } from '@phosphor-icons/react';

// Create a context to share the selected node between components
export const SelectedNodeContext = React.createContext<{
  selectedNode: any;
  setSelectedNode: React.Dispatch<React.SetStateAction<any>>;
}>({
  selectedNode: null,
  setSelectedNode: () => {},
});

const WorkflowPage = () => {
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to track the selected node
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Animation state for the panel
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  // Use state for window dimensions with initial values
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

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
  
  // Control panel visibility with animation
  useEffect(() => {
    if (selectedNode) {
      setIsPanelVisible(true);
    } else {
      // Delay hiding the panel to allow for animation
      const timer = setTimeout(() => {
        setIsPanelVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedNode]);

  // Handle panel close
  const handlePanelClose = () => {
    // Clear the selected node which will trigger the panel to close
    setSelectedNode(null);
  };

  // Calculate the right panel width - fixed width for floating panel
  const panelWidth = 350; // Fixed width for the floating panel

  // Expose the context to the window for access from other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).selectedNodeContext = { selectedNode, setSelectedNode };

      return () => {
        delete (window as any).selectedNodeContext;
      };
    }
  }, [selectedNode, setSelectedNode]);

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      <div
        ref={containerRef}
        className="relative flex overflow-y-hidden h-full bg-white text-gray-800"
      >
        {/* Full-width workflow container */}
        <div className="flex-1 h-full bg-gray-50 text-gray-800">
          <Workflow />
        </div>

        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            selectedNode ? 'opacity-20' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handlePanelClose}
        />

        {/* Floating panel with animation */}
        <div 
          className={`absolute right-4 top-4 bottom-4 transition-all duration-300 ease-in-out ${
            selectedNode 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-20 pointer-events-none'
          }`}
          style={{ width: `${panelWidth}px` }}
        >
          {(selectedNode || isPanelVisible) && (
            <div className="h-full bg-white shadow-lg rounded-lg border border-gray-200 z-10">
              <button
                onClick={handlePanelClose}
                className="absolute left-[-12px] top-4 bg-gray-100 hover:bg-gray-200 rounded-l-md p-1 z-10 shadow-md transition-all duration-200 hover:scale-110"
                title="Close panel"
              >
                <CaretLeft size={16} weight="bold" className="text-gray-700" />
              </button>
              <NodeConfigPanel
                width={panelWidth}
                onClose={handlePanelClose}
              />
            </div>
          )}
        </div>
      </div>
    </SelectedNodeContext.Provider>
  );
};

export default WorkflowPage;
