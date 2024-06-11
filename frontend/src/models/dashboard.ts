import { API_BASE } from "@/utils/constants";
import { AllJobOptions } from "./types/dashboard";

const Dashboard = {
  getJobOptions: async () => {
    try {
      const response = await fetch(`${API_BASE}/job/options`, {
        method: "GET",
      });

      const respJson: AllJobOptions = await response.json();
      return {
        success: true,
        data: respJson,
      };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  },
};

export default Dashboard;
