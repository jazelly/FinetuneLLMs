import produce from 'immer';
import { useCallback, useContext } from 'react';
import { BlockEnum } from '../types';
import { useNodesReadOnly } from './hooks';
import { useStore } from '../store';
import { useParams } from 'react-router-dom';
import WorkflowModel from '@/models/workflow';
import { useStoreApi } from 'reactflow';
import { useWorkflowUpdate } from './workflow.hooks';
import { WorkflowContext } from '../context';

export const useNodesSyncDraft = () => {
  const store = useStoreApi();
  const workflowStore = useContext(WorkflowContext)!;
  const { getNodesReadOnly } = useNodesReadOnly();
  const { handleRefreshWorkflowDraft } = useWorkflowUpdate();
  const debouncedUpdateWorkflow = useStore((s) => s.debouncedUpdateWorkflow);
  const params = useParams();

  const getPostParams = useCallback(() => {
    const { getNodes, edges, transform } = store.getState();
    const [x, y, zoom] = transform;
    const { workflowId, syncWorkflowDraftHash } = workflowStore.getState();

    if (workflowId) {
      const nodes = getNodes();
      const hasStartNode = nodes.find(
        (node) => node.data.type === BlockEnum.Start
      );

      if (!hasStartNode) return;

      const producedNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          Object.keys(node.data).forEach((key) => {
            if (key.startsWith('_')) delete node.data[key];
          });
        });
      });
      const producedEdges = produce(edges, (draft) => {
        draft.forEach((edge) => {
          Object.keys(edge.data).forEach((key) => {
            if (key.startsWith('_')) delete edge.data[key];
          });
        });
      });
      return {
        url: `/apps/${workflowId}/workflows/draft`,
        params: {
          graph: {
            nodes: producedNodes,
            edges: producedEdges,
            viewport: {
              x,
              y,
              zoom,
            },
          },
        },
      };
    }
  }, [store, workflowStore]);

  const doSyncWorkflowDraft = useCallback(
    async (notRefreshWhenSyncError?: boolean) => {
      if (getNodesReadOnly()) return;
      const postParams = getPostParams();

      if (postParams) {
        const { setSyncWorkflowDraftHash, setDraftUpdatedAt } =
          workflowStore.getState();
        try {
          const res = await WorkflowModel.updateWorkflow(
            postParams.params as any
          );
        } catch (error: any) {
          if (error && error.json && !error.bodyUsed) {
            error.json().then((err: any) => {
              if (
                err.code === 'draft_workflow_not_sync' &&
                !notRefreshWhenSyncError
              )
                handleRefreshWorkflowDraft();
            });
          }
        }
      }
    },
    [workflowStore, getPostParams, getNodesReadOnly, handleRefreshWorkflowDraft]
  );

  const handleSyncWorkflowDraft = useCallback(
    (sync?: boolean, notRefreshWhenSyncError?: boolean) => {
      if (getNodesReadOnly()) return;

      if (sync) doSyncWorkflowDraft(notRefreshWhenSyncError);
      else debouncedUpdateWorkflow(doSyncWorkflowDraft);
    },
    [debouncedUpdateWorkflow, doSyncWorkflowDraft, getNodesReadOnly]
  );

  return {
    doSyncWorkflowDraft,
    handleSyncWorkflowDraft,
  };
};
