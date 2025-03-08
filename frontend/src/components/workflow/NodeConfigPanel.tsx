import React, { useContext } from 'react';
import { BlockEnum } from './types';
import StartNodePanel from './nodes/start/panel';
import { SelectedNodeContext } from '../../pages/workflow.page';

// Map of node types to their panel components
const NodePanelMap: Record<string, React.ComponentType<any>> = {
  [BlockEnum.Start]: StartNodePanel,
  // Add other node types and their panel components here as needed
  [BlockEnum.IfElse]: () => <div>If-Else Configuration</div>,
  [BlockEnum.Dataset]: () => <div>Dataset Configuration</div>,
  [BlockEnum.Model]: () => <div>Model Configuration</div>,
  [BlockEnum.Train]: () => <div>Train Configuration</div>,
};

interface NodeConfigPanelProps {
  width: number;
  onClose?: () => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  width,
  onClose,
}) => {
  // Use the shared context to access the selected node
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext);

  // Determine if panel should be shown (only when a node is selected)
  const shouldShowPanel = !!selectedNode;

  // Get the panel component for the selected node type
  const nodeType = selectedNode?.type;
  const PanelComponent = nodeType
    ? NodePanelMap[nodeType as string] || null
    : null;

  // Handle node deselection and panel collapse
  const handleClose = () => {
    // Deselect the node
    setSelectedNode(null);

    // Collapse the panel if onClose is provided
    if (onClose) {
      onClose();
    }
  };

  // If no node is selected, show a message
  if (!shouldShowPanel) {
    return (
      <div
        className="flex flex-col h-full border-l border-gray-700 bg-gray-800"
        style={{ width: `${width}px` }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-gray-200">
            Node Configuration
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 text-gray-400">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            <p>Select a node to view its configuration</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full border-l border-gray-700 bg-gray-800"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-medium text-gray-200">
          {selectedNode?.title || 'Node Configuration'}
        </h2>
        <button
          onClick={handleClose}
          className="p-1 rounded-md hover:bg-gray-700 text-gray-300 transition-colors"
          title="Close panel"
        >
          <span className="text-xl">×</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {PanelComponent ? (
          <PanelComponent id={selectedNode.id} data={selectedNode} />
        ) : (
          <div className="text-gray-400 p-4 bg-gray-900 rounded-md">
            {selectedNode?.desc ||
              'No configuration options available for this node.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeConfigPanel;
