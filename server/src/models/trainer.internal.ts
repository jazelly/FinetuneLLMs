import { SubmitJobParams } from "./schema/trainer.internal.type";
import { request } from "undici";

const Trainer = {
  submitJobToTrainer: async (params: SubmitJobParams) => {
    const trainerApi = `${process.env.TRAINER_API_URL}job`;
    try {
      const { body } = await request(trainerApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await body.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  },
};

export default Trainer;
