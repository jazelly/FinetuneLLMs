import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DatasetNode from './nodes/dataset.node';
import TrainerNode from './nodes/trainer.node';

// Define node types
const nodeTypes: NodeTypes = {
  datasetNode: DatasetNode,
  trainerNode: TrainerNode,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 5 },
    data: {},
  },
  {
    id: '2',
    type: 'if-else',
    position: { x: 250, y: 200 },
    data: {},
  },
];

// Initial edges
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const WorkflowCanva: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanva;
