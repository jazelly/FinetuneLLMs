import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import produce, { setAutoFreeze } from 'immer';
import { useEventListener, useKeyPress } from 'ahooks';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  SelectionMode,
  ConnectionLineType,
  useEdges,
  useEdgesState,
  useNodesState,
  useOnViewportChange,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import type { Viewport } from 'reactflow';
import 'reactflow/dist/style.css';
import './style.css';
import { AllNodeTypes, BlockEnum, Edge, Node, CustomNodeType } from './types';
import { WorkflowContext, WorkflowContextProvider } from './context';
import {
  useNodesInteractions,
  useNodesReadOnly,
  usePanelInteractions,
  useWorkflow,
} from './hooks/hooks';
import CustomNode from './nodes';
import Operator from './tools';
import CustomEdge from './custom-edge';
import CustomConnectionLine from './custom-connection-line';
import CandidateNode from './candidate-node';
import { useStore } from './store';
import {
  generateNewNode,
  getKeyboardKeyCodeBySystem,
  initNodesAndEdges,
  sortNodes,
} from './utils';
import {
  ITERATION_CHILDREN_Z_INDEX,
  NODE_WIDTH,
  NODES_INITIAL_DATA,
  WORKFLOW_DATA_UPDATE,
} from './constants';
import { useEventEmitterContextContext } from '@/src/contexts/EventEmitter';
import { RunningSpinner } from '../reusable/Loaders.component';
import { useEdgesInteractions } from './hooks/use-edges-interactions';
import { useSelectionInteractions } from './hooks/use-selection-interactions';
import { NodeSelector } from './NodeSelector.component';
import { NodeDetailStateProvider } from '@/src/contexts/Workflow.context';
import { v4 } from 'uuid';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';

// Import test fixture data
import { initialNodes, initialEdges } from '../../../test/fixture/workflow-nodes';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/src/utils/constants';

const nodeTypes: Record<CustomNodeType, React.FC> = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

interface WorkflowProps {
  nodes: Node<AllNodeTypes>[];
  edges: Edge[];
  viewport?: Viewport;
  workflowId?: string;
  initialData?: any;
  onWorkflowChange?: (data: any) => void;
}

const Workflow: FC<WorkflowProps> = memo(
  ({ nodes: originalNodes, edges: originalEdges, viewport, workflowId, initialData, onWorkflowChange }) => {
    const workflowContainerRef = useRef<HTMLDivElement>(null);
    const workflowStore = useContext(WorkflowContext)!;
    const controlMode = useStore((s) => s.controlMode);
    const nodeAnimation = useStore((s) => s.nodeAnimation);
    const { nodesReadOnly } = useNodesReadOnly();
    const store = useStoreApi();
    const reactflow = useReactFlow();

    // Track if we need to send an update
    const shouldUpdateRef = useRef(false);

    // Handle delayed update to backend
    useEffect(() => {
      if (!onWorkflowChange || !initialData) return;

      // Function to send workflow data to parent
      const sendUpdate = () => {
        const { getNodes } = store.getState();
        const currentNodes = getNodes();
        const { edges: currentEdges } = store.getState();
        const { getViewport } = reactflow;
        const currentViewport = getViewport();
        
        const workflowData = {
          ...initialData,
          zoom: currentViewport.zoom,
          nodes: currentNodes.map(node => ({
            id: node.id.includes('-') ? undefined : node.id,
            nodeId: node.id,
            type: node.data.type,
            positionX: node.position.x,
            positionY: node.position.y,
            data: node.data,
          })),
          edges: currentEdges.map(edge => ({
            id: edge.id.includes('-') ? undefined : edge.id,
            sourceNodeId: edge.source,
            targetNodeId: edge.target,
          })),
        };
        
        onWorkflowChange(workflowData);
        shouldUpdateRef.current = false;
      };
      
      // Check for updates every 2 seconds if changes detected
      const interval = setInterval(() => {
        if (shouldUpdateRef.current) {
          sendUpdate();
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }, [store, reactflow, initialData, onWorkflowChange]);

    // Patch the handlers to trigger updates
    const originalHandleNodeDragStop = handleNodeDragStop;
    const patchedHandleNodeDragStop = useCallback((...args) => {
      if (originalHandleNodeDragStop) {
        originalHandleNodeDragStop(...args);
      }
      shouldUpdateRef.current = true;
    }, [originalHandleNodeDragStop]);
    handleNodeDragStop = patchedHandleNodeDragStop;
    
    const originalHandleNodeConnect = handleNodeConnect;
    const patchedHandleNodeConnect = useCallback((...args) => {
      if (originalHandleNodeConnect) {
        originalHandleNodeConnect(...args);
      }
      shouldUpdateRef.current = true;
    }, [originalHandleNodeConnect]);
    handleNodeConnect = patchedHandleNodeConnect;
    
    const originalHandleEdgesChange = handleEdgesChange;
    const patchedHandleEdgesChange = useCallback((...args) => {
      if (originalHandleEdgesChange) {
        originalHandleEdgesChange(...args);
      }
      shouldUpdateRef.current = true;
    }, [originalHandleEdgesChange]);
    handleEdgesChange = patchedHandleEdgesChange;

    // Handle DnD for node creation
    const handleNodeDrop = useCallback((type: BlockEnum, position: { x: number, y: number }) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();
      const nodesWithSameType = nodes.filter(
        (node) => node.data.type === type
      );

      // Get the workflow container's bounding rect
      const containerRect = workflowContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      console.log('drop position', position.x, position.y);

      // Calculate the position relative to the workflow container
      const relativeX = position.x;
      const relativeY = position.y;

      const newNode = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[type],
          title:
            nodesWithSameType.length > 0
              ? `${type} ${nodesWithSameType.length + 1}`
              : type,
          isCandidate: true,
        } as any,
        position: {
          x: relativeX,
          y: relativeY,
        },
      });

      const { screenToFlowPosition, getZoom } = reactflow;
      const zoom = getZoom();
      
      // This handles sidebar and header offset
      const { x, y } = screenToFlowPosition({
        x: relativeX,
        y: relativeY,
      });

      // Base dimensions
      const nodeHeight = 100;

      // Calculate offset based on the inverse scale to maintain proper centering
      const scale = 1 / zoom;
      const offsetX = (NODE_WIDTH * scale) / 2;
      const offsetY = (nodeHeight * scale) / 2;

      const newNodes = produce(nodes, (draft) => {
        draft.push({
          ...newNode,
          data: newNode.data,
          position: {
            x: x,
            y: y ,
          },
        });
      });
      setNodes(newNodes);
    }, [reactflow, store]);

    const { setNodes, getNodes, setEdges } = store.getState();
    const edges = originalEdges;
    const nodes = originalNodes;
    const { setViewport } = reactflow;

    useEffect(() => {
      const tn = getNodes();
      console.log('tn', tn);
      setNodes(originalNodes);
      setEdges(originalEdges);
      setViewport({
        x: 0,
        y: 0,
        zoom: 1,
      });
    }, []);

    const { eventEmitter } = useEventEmitterContextContext();

    eventEmitter?.useSubscription((v: any) => {
      if (v.type === WORKFLOW_DATA_UPDATE) {
        setNodes(v.payload.nodes);
        setEdges(v.payload.edges);
      }
    });

    useEffect(() => {
      setAutoFreeze(false);
      return () => {
        setAutoFreeze(true);
      };
    }, []);

    useEventListener('mousemove', (e) => {
      const containerClientRect =
        workflowContainerRef.current?.getBoundingClientRect();

      if (containerClientRect) {
        workflowStore.setState({
          mousePosition: {
            pageX: e.clientX,
            pageY: e.clientY,
            elementX: e.clientX - containerClientRect.left,
            elementY: e.clientY - containerClientRect.top,
          },
        });
      }
    });

    const {
      handleNodeDragStart,
      handleNodeDrag,
      handleNodeEnter,
      handleNodeLeave,
      handleNodeClick,
      handleNodeContextMenu,
    } = useNodesInteractions();
    const {
      handleEdgeEnter,
      handleEdgeLeave,
      handleEdgeDelete,
    } = useEdgesInteractions();
    const { handleSelectionStart, handleSelectionChange, handleSelectionDrag } =
      useSelectionInteractions();
    const { handlePaneContextMenu } = usePanelInteractions();
    const { isValidConnection, handleLayout } = useWorkflow();

    useOnViewportChange({
      onEnd: () => {},
    });

    useKeyPress('delete', handleEdgeDelete);
    useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.c`, handleNodesCopy, {
      exactMatch: true,
      useCapture: true,
    });
    useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.v`, handleNodesPaste, {
      exactMatch: true,
      useCapture: true,
    });
    useKeyPress(
      `${getKeyboardKeyCodeBySystem('ctrl')}.d`,
      handleNodesDuplicate,
      {
        exactMatch: true,
        useCapture: true,
      }
    );
    const router = useRouter();

    const handleRunAll = () => {
      const jobId = v4();
    };

    // Load initial data when available
    useEffect(() => {
      if (initialData?.nodes && initialData?.edges) {
        try {
          // Convert backend data to ReactFlow format
          const flowNodes = initialData.nodes.map(node => ({
            id: node.nodeId,
            type: 'custom',
            position: { x: node.positionX, y: node.positionY },
            data: { ...node.data, type: node.type },
          }));
          
          const flowEdges = initialData.edges.map(edge => ({
            id: edge.id || `${edge.sourceNodeId}-${edge.targetNodeId}`,
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            type: 'custom',
          }));
          
          // Set nodes and edges
          setNodes(flowNodes);
          setEdges(flowEdges);
          
          // Set viewport if available
          if (initialData.zoom) {
            setViewport({
              x: 0,
              y: 0,
              zoom: initialData.zoom || 1,
            });
          }
        } catch (err) {
          console.error('Error loading workflow data:', err);
        }
      }
    }, [initialData, setNodes, setEdges, setViewport]);

    return (
      <div
        id="workflow-container"
        className={`
        relative w-full h-full
        ${nodeAnimation && 'workflow-node-animation'}
      `}
        ref={workflowContainerRef}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          // Add a subtle highlight effect when dragging over the workflow area
          e.currentTarget.classList.add('bg-indigo-50', 'bg-opacity-30');
        }}
        onDragLeave={(e) => {
          // Remove the highlight effect when dragging leaves the workflow area
          e.currentTarget.classList.remove('bg-indigo-50', 'bg-opacity-30');
        }}
        onDrop={(e) => {
          e.preventDefault();
          // Remove the highlight effect when dropping
          e.currentTarget.classList.remove('bg-indigo-50', 'bg-opacity-30');
          
          const type = e.dataTransfer.getData('nodeType') as BlockEnum;
          if (type) {
            // Create a brief flash effect at the drop position
            const flashElement = document.createElement('div');
            flashElement.style.position = 'absolute';
            flashElement.style.left = `${e.clientX - 20}px`;
            flashElement.style.top = `${e.clientY - 20}px`;
            flashElement.style.width = '40px';
            flashElement.style.height = '40px';
            flashElement.style.borderRadius = '50%';
            flashElement.style.backgroundColor = '#6366f1';
            flashElement.style.opacity = '0.5';
            flashElement.style.transition = 'all 0.3s ease-out';
            document.body.appendChild(flashElement);
            
            // Animate and remove the flash element
            setTimeout(() => {
              flashElement.style.transform = 'scale(2)';
              flashElement.style.opacity = '0';
              setTimeout(() => {
                document.body.removeChild(flashElement);
              }, 300);
            }, 10);
            
            // Create the actual node
            handleNodeDrop(type, { x: e.clientX, y: e.clientY });
          }
        }}
      >
        <CandidateNode />
        <button
          onClick={handleRunAll}
          className="absolute top-4 right-4 z-[100] bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          Run All
        </button>

        <div className="z-[100] absolute top-5 left-2">
          <NodeSelector />
        </div>
        <Operator />
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodeDragStart={handleNodeDragStart}
          onNodeDrag={handleNodeDrag}
          onNodeDragStop={handleNodeDragStop}
          onNodeMouseEnter={handleNodeEnter}
          onNodeMouseLeave={handleNodeLeave}
          onNodeClick={handleNodeClick}
          onNodeContextMenu={handleNodeContextMenu}
          onConnect={handleNodeConnect}
          onEdgeMouseEnter={handleEdgeEnter}
          onEdgeMouseLeave={handleEdgeLeave}
          onEdgesChange={handleEdgesChange}
          onSelectionStart={handleSelectionStart}
          onSelectionChange={handleSelectionChange}
          onSelectionDrag={handleSelectionDrag}
          onPaneContextMenu={handlePaneContextMenu}
          connectionLineType={ConnectionLineType.Bezier}
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
          connectionLineComponent={CustomConnectionLine}
          connectionLineContainerStyle={{ zIndex: ITERATION_CHILDREN_Z_INDEX }}
          defaultViewport={viewport}
          multiSelectionKeyCode={null}
          deleteKeyCode={null}
          nodesDraggable={!nodesReadOnly}
          nodesConnectable={!nodesReadOnly}
          nodesFocusable={!nodesReadOnly}
          edgesFocusable={!nodesReadOnly}
          panOnDrag={controlMode === 'hand'}
          zoomOnPinch={true}
          zoomOnScroll={true}
          zoomOnDoubleClick={true}
          isValidConnection={isValidConnection}
          selectionKeyCode={null}
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={controlMode === 'pointer'}
          minZoom={0.25}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={[14, 14]} size={2} color="#9CA3AF" />
        </ReactFlow>
      </div>
    );
  }
);
Workflow.displayName = 'Workflow';

const WorkflowWrap = memo(() => {
  const [isLoading, setIsLoading] = useState(false);

  // Use the test fixture data for nodes and edges
  const nodesAndEdges = useMemo(() => {
    return {
      nodes: initialNodes,
      edges: initialEdges,
    };
  }, []);

  // Simulate loading for testing purposes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center relative w-full h-full bg-gray-100">
        <RunningSpinner size={32} color={'#6366f1'} />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <Workflow
          nodes={nodesAndEdges.nodes}
          edges={nodesAndEdges.edges}
          viewport={{ x: 0, y: 0, zoom: 1 }}
        />
      </ReactFlowProvider>
    </DndProvider>
  );
});
WorkflowWrap.displayName = 'WorkflowWrap';

const WorkflowContainer = () => {
  return (
    <WorkflowContextProvider>
      <NodeDetailStateProvider>
        <WorkflowWrap />
      </NodeDetailStateProvider>
    </WorkflowContextProvider>
  );
};

// Export the ReactFlowProvider for use in other components
export const WorkflowReactFlowProvider = ReactFlowProvider;

export default memo(WorkflowContainer);
