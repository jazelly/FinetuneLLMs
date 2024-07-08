import {
  flexUserRoleValid,
  ROLES,
} from "../utils/middleware/multiUserProtected";
import { validatedRequest } from "../utils/middleware/validatedRequest";
import { reqBody } from "../utils/http";
import { Datasets } from "../models/datasets";
import { Jobs } from "../models/jobs";
import { v4 } from "uuid";
import Trainer, { TrainerResponseBase } from "../models/trainer.internal";
import { DatasetRemote } from "../models/schema/datasets.type";
import {
  BASE_MODELS,
  EXAMPLE_DATASETS,
  TRAINING_METHODS,
} from "../utils/supportList";

function jobEndpoints(app) {
  if (!app) return;

  app.get(
    "/job/options",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      const result = {
        datasets: [] as any,
        trainingMethods: [] as any,
        baseModels: [] as any,
        hyperparameters: [] as any,
      };

      const datasetsPromise = Datasets.readAll();

      const hyperparameters = {
        bf16: true,
        do_eval: false,
        learning_rate: 5.0e-6,
        log_level: "info",
        logging_steps: 20,
        logging_strategy: "steps",
        lr_scheduler_type: "cosine",
        num_train_epochs: 1,
        max_steps: -1,
        output_dir: "./checkpoint_dir",
        overwrite_output_dir: true,
        per_device_eval_batch_size: 4,
        per_device_train_batch_size: 8,
        remove_unused_columns: true,
        save_steps: 100,
        save_total_limit: 1,
        seed: 0,
        gradient_checkpointing: true,
        gradient_checkpointing_kwargs: { use_reentrant: false },
        gradient_accumulation_steps: 1,
        warmup_ratio: 0.2,
      };

      const [datasets] = await Promise.all([datasetsPromise]);
      result.datasets = datasets.length ? datasets : EXAMPLE_DATASETS;
      result.trainingMethods = TRAINING_METHODS;
      result.baseModels = BASE_MODELS;
      result.hyperparameters = hyperparameters;

      res.json(result);
    }
  );

  app.get(
    "/job/:jobId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      const { jobId } = req.params;

      let id: number;
      try {
        id = parseInt(jobId, 10);
      } catch (err: any) {
        return res.status(400);
      }

      const jobs = await Jobs.readBy({
        id,
      });

      res.json(jobs[0]);
    }
  );

  /**
   * Create a job record in DB
   * The job created is incomplete as we cannot know the taskId
   * This simply creates a log so that other requests can look up on that
   * NOTE: we do not trigger a worker job here. It's triggered by client
   */
  app.post(
    "/job",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      const { datasetName, trainingMethod, baseModel, hyperparameters } =
        reqBody(req);

      const metaString = JSON.stringify(hyperparameters);

      // persist the job to Database
      const name = `${trainingMethod}-${baseModel}-${datasetName}`;
      const result = await Jobs.create({
        name,
        datasetName,
        trainingMethod,
        baseModel,
        hyperparameters: metaString,
      });

      res.json(result);
    }
  );
}

export { jobEndpoints };
