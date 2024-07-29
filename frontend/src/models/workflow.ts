import { API_BASE } from '@/utils/constants';
import {
  BlockEnum,
  type Node,
  type Edge,
  type WorkflowGraphRecord,
  WorkflowDataUpdator,
} from '@/components/workflow/types';
import type {
  HTTPResponseError,
  HTTPResponseSuccess,
} from '@/types/common.type';
import { v4 } from 'uuid';

const Workflow = {
  getDefaultWorkflow: async (): Promise<
    HTTPResponseSuccess<WorkflowDataUpdator> | HTTPResponseError
  > => {
    try {
      const resp = await fetch(`${API_BASE}/workflow/default`, {
        method: 'GET',
      });

      const data = await resp.json();

      return { success: true, data };
    } catch (error: any) {
      // TODO: stubbed
      const initialNodes: Node[] = [
        {
          id: '1',
          position: { x: 250, y: 5 },
          data: {
            id: '1',
            title: 'Start',
            desc: '',
            type: BlockEnum.Start,
          },
        },
        {
          id: '2',
          position: { x: 250, y: 5 },
          data: {
            id: '2',
            title: 'IF Else',
            desc: '',
            type: BlockEnum.IfElse,
          },
        },
      ];

      const edges: Edge[] = [
        {
          id: '3',
          source: '1',
          target: '2',
        },
      ];
      return {
        success: true,
        data: { id: v4(), nodes: initialNodes, edges } as any,
      };
    }
  },
  getWorkflow: async (
    workflowId: string
  ): Promise<HTTPResponseSuccess<WorkflowGraphRecord> | HTTPResponseError> => {
    try {
      const resp = await fetch(`${API_BASE}/workflow/${workflowId}`, {
        method: 'GET',
      });

      const data = await resp.json();

      return { success: true, data };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },

  updateWorkflow: async (params: Partial<WorkflowGraphRecord>) => {
    try {
      const resp = await fetch(`${API_BASE}/workflow/`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      const data = await resp.json();

      return { success: true, data };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },
};

export default Workflow;
