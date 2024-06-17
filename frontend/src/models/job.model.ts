import { API_BASE } from '@/utils/constants';
import { baseHeaders } from '@/utils/request';
import type {
  HTTPResponseError,
  HTTPResponseSuccess,
  JobCreate,
  JobDetail,
} from '@/types/dashboard.type';

const Job = {
  submitJob: async (
    jobOptions: JobCreate
  ): Promise<HTTPResponseSuccess<JobDetail> | HTTPResponseError> => {
    try {
      const resp = await fetch(`${API_BASE}/job`, {
        method: 'POST',
        headers: baseHeaders(),
        body: JSON.stringify(jobOptions),
      });

      const data = await resp.json();

      console.log('res', data);
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
