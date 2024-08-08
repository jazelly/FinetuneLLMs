import { useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from '../store';
import WorkflowModel from '@/models/workflow';
import { WorkflowDataUpdator, WorkflowGraphRecord } from '../types';
import { useReactFlow } from 'reactflow';
import { useEventEmitterContextContext } from '@/contexts/EventEmitter';
import { WORKFLOW_DATA_UPDATE } from '../constants';
import { WorkflowContext } from '../context';

export const useWorkflowInit = () => {
  const [data, setData] = useState<WorkflowDataUpdator>();
  const [isLoading, setIsLoading] = useState(true);

  const handleGetInitialWorkflowData = async () => {
    const res = await WorkflowModel.getDefaultWorkflow();

    if (res.success) setData(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetInitialWorkflowData();
  }, []);

  return {
    data,
    isLoading,
  };
};

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

  const handleRefreshWorkflowDraft = useCallback(async () => {
    const { workflowId } = workflowStore.getState();
    const resp = await WorkflowModel.getWorkflow(workflowId);
    if (resp.success) {
      handleUpdateWorkflowCanvas(resp.data as any);
    }
  }, [handleUpdateWorkflowCanvas, workflowStore]);

  return {
    handleUpdateWorkflowCanvas,
    handleRefreshWorkflowDraft,
  };
};
