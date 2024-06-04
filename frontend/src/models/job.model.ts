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

      const res = await resp.json();

      return { success: true, data: res };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },
};

export default Job;
