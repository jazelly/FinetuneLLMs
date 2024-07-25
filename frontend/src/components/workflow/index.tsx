'use client';

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
} from 'reactflow';
import type { Viewport } from 'reactflow';
import 'reactflow/dist/style.css';
import './style.css';
import type { Edge, Node } from './types';
import { WorkflowContextProvider } from './context';
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
import { useStore, useWorkflowStore } from './store';
import {
  getKeyboardKeyCodeBySystem,
  initialEdges,
  initialNodes,
} from './utils';
import { ITERATION_CHILDREN_Z_INDEX, WORKFLOW_DATA_UPDATE } from './constants';
import { useEventEmitterContextContext } from '@/contexts/EventEmitter';
import React from 'react';
import { RunningSpinner } from '../reusable/Loaders.component';
import { useWorkflowInit } from './hooks/workflow.hooks';
import { useEdgesInteractions } from './hooks/use-edges-interactions';
import { useSelectionInteractions } from './hooks/use-selection-interactions';

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

type WorkflowProps = {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
};
const Workflow: FC<WorkflowProps> = memo(
  ({ nodes: originalNodes, edges: originalEdges, viewport }) => {
    const workflowContainerRef = useRef<HTMLDivElement>(null);
    const workflowStore = useWorkflowStore();
    const [nodes, setNodes] = useNodesState(originalNodes);
    const [edges, setEdges] = useEdgesState(originalEdges);
    const controlMode = useStore((s) => s.controlMode);
    const nodeAnimation = useStore((s) => s.nodeAnimation);
    const { nodesReadOnly } = useNodesReadOnly();

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

    useEventListener('keydown', (e) => {
      if ((e.key === 'd' || e.key === 'D') && (e.ctrlKey || e.metaKey))
        e.preventDefault();
    });
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
    const { isValidConnection } = useWorkflow();

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
      { exactMatch: true, useCapture: true }
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

  const nodesData = useMemo(() => {
    if (data) return initialNodes(data.nodes as any, data.edges as any);

    return [];
  }, [data]);
  const edgesData = useMemo(() => {
    if (data) return initialEdges(data.edges as any, data.nodes as any);

    return [];
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
      <Workflow nodes={nodesData} edges={edgesData} viewport={data.viewport} />
    </ReactFlowProvider>
  );
});
WorkflowWrap.displayName = 'WorkflowWrap';

const WorkflowContainer = () => {
  return (
    <WorkflowContextProvider>
      <WorkflowWrap />
    </WorkflowContextProvider>
  );
};

export default memo(WorkflowContainer);
