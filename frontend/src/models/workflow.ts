import { API_BASE } from '@/utils/constants';
import { baseHeaders } from '@/utils/request';
import type { Workflow } from '@/components/workflow/types';
import type {
  HTTPResponseError,
  HTTPResponseSuccess,
} from '@/types/common.type';

const Job = {
  getWorkflow: async (
    workflowId: string
  ): Promise<HTTPResponseSuccess<Workflow> | HTTPResponseError> => {
    try {
      const resp = await fetch(`${API_BASE}/workflow/${workflowId}`, {
        method: 'GET',
        headers: baseHeaders(),
      });

      const data = await resp.json();

      return { success: true, data };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },

  getJobDetail: async (
    jobId: string
  ): Promise<HTTPResponseSuccess<JobDetail> | HTTPResponseError> => {
    try {
      const resp = await fetch(`${API_BASE}/job/${jobId}`, {
        method: 'GET',
        headers: baseHeaders(),
      });

      const res = await resp.json();

      return { success: true, data: res };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },
};

export default Job;
