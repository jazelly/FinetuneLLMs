import { SubmitJobParams } from "./schema/trainer.internal.type";
import { request } from "undici";
import type { Dispatcher } from "undici" 

export interface TrainerResponseBase {
  status: "success" | "failed" | "error"; // 200, 400, 500
  message: string;
  data?: Record<string, any>;
}

export interface TrainerResponseNode extends TrainerResponseBase {
  code: number;
}

const Trainer = {
  submitJobToTrainer: async (params: SubmitJobParams): Promise<TrainerResponseNode> => {
    const trainerApi = `${process.env.TRAINER_API_URL}train/job/`;

    let statusCode;
    try {
      const resp = await request(trainerApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      statusCode = resp.statusCode;
      if (resp.statusCode >= 300) { throw new Error() }

      const body = resp.body

      const data = await body.json();
      return { ...data as TrainerResponseBase, code: statusCode };
    } catch (error) {
      console.error("Error:", error);
      return { status: "error", code: statusCode, message: "noop" };
    }
  },
};

export default Trainer;
