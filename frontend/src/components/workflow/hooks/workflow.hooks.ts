import { useCallback, useEffect, useState } from 'react';
import { useStore, useWorkflowStore } from '../store';
import WorkflowModel from '@/models/workflow';
import { WorkflowDataUpdator, WorkflowGraphRecord } from '../types';
import { useReactFlow } from 'reactflow';
import { useEventEmitterContextContext } from '@/contexts/EventEmitter';
import { WORKFLOW_DATA_UPDATE } from '../constants';
import { initialEdges, initialNodes } from '../utils';

export const useWorkflowInit = () => {
  const workflowStore = useWorkflowStore();
  const setSyncWorkflowDraftHash = useStore((s) => s.setSyncWorkflowDraftHash);
  const [data, setData] = useState<WorkflowDataUpdator>();
  const [isLoading, setIsLoading] = useState(true);

  const handleGetInitialWorkflowData = useCallback(async () => {
    const res = await WorkflowModel.getDefaultWorkflow();

    if (res.success) setData(res.data);
    setIsLoading(false);
  }, [workflowStore, setSyncWorkflowDraftHash]);

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
  const workflowStore = useWorkflowStore();
  const { eventEmitter } = useEventEmitterContextContext();

  const handleUpdateWorkflowCanvas = useCallback(
    (payload: WorkflowDataUpdator) => {
      const { nodes, edges, viewport } = payload;
      const { setViewport } = reactflow;
      eventEmitter?.emit({
        type: WORKFLOW_DATA_UPDATE,
        payload: {
          nodes: initialNodes(nodes, edges),
          edges: initialEdges(edges, nodes),
        },
      } as any);
      setViewport(viewport);
    },
    [eventEmitter, reactflow]
  );

  const handleRefreshWorkflowDraft = useCallback(async () => {
    const { appId } = workflowStore.getState();
    const resp = await WorkflowModel.getWorkflow(appId);
    if (resp.success) {
      handleUpdateWorkflowCanvas(resp.data as any);
    }
  }, [handleUpdateWorkflowCanvas, workflowStore]);

  return {
    handleUpdateWorkflowCanvas,
    handleRefreshWorkflowDraft,
  };
};
