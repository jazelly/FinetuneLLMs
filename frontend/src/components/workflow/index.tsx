import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { setAutoFreeze } from 'immer';
import { useEventListener, useKeyPress } from 'ahooks';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useOnViewportChange,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import type { Viewport } from 'reactflow';
import 'reactflow/dist/style.css';
import './style.css';
import { BlockEnum, Edge, Node } from './types';
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
  getKeyboardKeyCodeBySystem,
  initNodesAndEdges,
  sortNodes,
} from './utils';
import { ITERATION_CHILDREN_Z_INDEX, WORKFLOW_DATA_UPDATE } from './constants';
import { useEventEmitterContextContext } from '@/contexts/EventEmitter';
import { RunningSpinner } from '../reusable/Loaders.component';
import { useWorkflowInit } from './hooks/workflow.hooks';
import { useEdgesInteractions } from './hooks/use-edges-interactions';
import { useSelectionInteractions } from './hooks/use-selection-interactions';
import { NodeSelector } from './NodeSelector.component';
import { TrainerMessageMapContext } from '@/contexts/TrainerMessageMap.context';
import { NodeDetailStateProvider } from '@/contexts/Workflow.context';

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

interface WorkflowProps {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
}

const Workflow: FC<WorkflowProps> = memo(
  ({ nodes: originalNodes, edges: originalEdges, viewport }) => {
    const [isFirstUpdate, setIsFirstUpdate] = useState(true);

    const workflowContainerRef = useRef<HTMLDivElement>(null);
    const workflowStore = useContext(WorkflowContext)!;
    const [nodes, setNodes] = useNodesState(originalNodes);
    const [edges, setEdges] = useEdgesState(originalEdges);
    console.log('afterInit', nodes, edges);
    const controlMode = useStore((s) => s.controlMode);
    const nodeAnimation = useStore((s) => s.nodeAnimation);
    const { nodesReadOnly } = useNodesReadOnly();
    const store = useStoreApi();
    const reactflow = useReactFlow();

    useEffect(() => {
      const { setNodes: setStoreNodes } = store.getState();
      const { setViewport } = reactflow;

      if (originalNodes.length && isFirstUpdate) {
        const newNodes = sortNodes(nodes, edges);
        console.log('afterSort', newNodes);
        setNodes(newNodes);
        setEdges(edges);
        setStoreNodes(newNodes);
        setViewport({
          x: 0,
          y: 0,
          zoom: 1,
        });
        setIsFirstUpdate(false);
      }
    }, [isFirstUpdate]);

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
      handleNodeDragStop,
      handleNodeEnter,
      handleNodeLeave,
      handleNodeClick,
      handleNodeConnect,
      handleNodeConnectStart,
      handleNodeConnectEnd,
      handleNodeContextMenu,
      handleNodesCopy,
      handleNodesPaste,
      handleNodesDuplicate,
      handleNodesDelete,
    } = useNodesInteractions();
    const {
      handleEdgeEnter,
      handleEdgeLeave,
      handleEdgeDelete,
      handleEdgesChange,
    } = useEdgesInteractions();
    const { handleSelectionStart, handleSelectionChange, handleSelectionDrag } =
      useSelectionInteractions();
    const { handlePaneContextMenu } = usePanelInteractions();
    const { isValidConnection, handleLayout } = useWorkflow();

    useOnViewportChange({
      onEnd: () => {},
    });

    useKeyPress('delete', handleNodesDelete);
    useKeyPress(['delete', 'backspace'], handleEdgeDelete);
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

    return (
      <div
        id="workflow-container"
        className={`
        relative w-full h-full
        ${nodeAnimation && 'workflow-node-animation'}
      `}
        ref={workflowContainerRef}
      >
        <CandidateNode />

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
          onConnectStart={handleNodeConnectStart}
          onConnectEnd={handleNodeConnectEnd}
          onEdgeMouseEnter={handleEdgeEnter}
          onEdgeMouseLeave={handleEdgeLeave}
          onEdgesChange={handleEdgesChange}
          onSelectionStart={handleSelectionStart}
          onSelectionChange={handleSelectionChange}
          onSelectionDrag={handleSelectionDrag}
          onPaneContextMenu={handlePaneContextMenu}
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
        >
          <Background gap={[14, 14]} size={2} color="#E4E5E7" />
        </ReactFlow>
      </div>
    );
  }
);
Workflow.displayName = 'Workflow';

const WorkflowWrap = memo(() => {
  const { data, isLoading } = useWorkflowInit();

  const nodesAndEdges = useMemo(() => {
    return initNodesAndEdges(data?.nodes, data?.edges);
  }, [data]);
  if (!data || isLoading) {
    return (
      <div className="flex justify-center items-center relative w-full h-full bg-[#F0F2F7]">
        <RunningSpinner size={32} color={'black'} />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <Workflow
        nodes={nodesAndEdges.nodes}
        edges={nodesAndEdges.edges}
        viewport={data.viewport}
      />
    </ReactFlowProvider>
  );
});
WorkflowWrap.displayName = 'WorkflowWrap';

const WorkflowContainer = () => {
  const { sendMessage } = useContext(TrainerMessageMapContext);

  const handleRunAll = async () => {
    if (!sendMessage) return;

    const data = {
      type: 'command',
      message: 'submitted a job',
      data: {
        baseModel: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        trainingMethod: 'SFT',
        datasetName: 'soulhq-ai/insuranceQA-v2',
      },
    };
    console.log('send to ws', data);
    sendMessage(JSON.stringify(data));

    return;
  };
  return (
    <WorkflowContextProvider>
      <NodeDetailStateProvider>
        <button
          onClick={handleRunAll}
          className="absolute top-4 right-4 z-[100] bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          Run All
        </button>
        <WorkflowWrap />
      </NodeDetailStateProvider>
    </WorkflowContextProvider>
  );
};

export default memo(WorkflowContainer);
