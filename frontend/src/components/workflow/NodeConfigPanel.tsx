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
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ width }) => {
  // Use the shared context to access the selected node
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext);

  // Determine if panel should be shown (only when a node is selected)
  const shouldShowPanel = !!selectedNode;

  // Get the panel component for the selected node type
  const nodeType = selectedNode?.type;
  const PanelComponent = nodeType
    ? NodePanelMap[nodeType as string] || null
    : null;

  // Handle node deselection
  const handleDeselectNode = () => {
    setSelectedNode(null);
  };

  if (!shouldShowPanel) {
    return null; // Don't render anything if no node is selected
  }

  return (
    <div
      className="flex flex-col h-full border-l border-gray-200 bg-white"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">
          {selectedNode?.title || 'Node Configuration'}
        </h2>
        <button
          onClick={handleDeselectNode}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <span className="text-xl">×</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {PanelComponent ? (
          <PanelComponent id={selectedNode.id} data={selectedNode} />
        ) : (
          <div className="text-gray-500">
            {selectedNode?.desc ||
              'No configuration options available for this node.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeConfigPanel;
