import { useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from '../store';
import { WorkflowDataUpdator, WorkflowGraphRecord } from '../types';
import { useReactFlow } from 'reactflow';
import { useEventEmitterContextContext } from '@/src/contexts/EventEmitter';
import { WORKFLOW_DATA_UPDATE } from '../constants';
import { WorkflowContext } from '../context';


export const useWorkflowUpdate = () => {
  const reactflow = useReactFlow();
  const workflowStore = useContext(WorkflowContext)!;
  const { eventEmitter } = useEventEmitterContextContext();

  const handleUpdateWorkflowCanvas = useCallback(
    (payload: WorkflowDataUpdator) => {
      const { nodes, edges, viewport } = payload;
      const { setViewport } = reactflow;
      eventEmitter?.emit({
        type: WORKFLOW_DATA_UPDATE,
        payload: payload,
      } as any);
      setViewport(viewport);
    },
    [eventEmitter, reactflow]
  );


  return {
    handleUpdateWorkflowCanvas,
  };
};
