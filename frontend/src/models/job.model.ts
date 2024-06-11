import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { JobCreate } from "./types/dashboard";

const Job = {
  submitJob: async (jobOptions: JobCreate) => {
    try {
      const resp = await fetch(`${API_BASE}/job`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify(jobOptions),
      });

      const data = await resp.json();

      console.log("res", data);
      return { success: true, data };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },

  getJobDetails: async (jobId: string) => {
    try {
      const resp = await fetch(`${API_BASE}/job/${jobId}`, {
        method: "GET",
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
