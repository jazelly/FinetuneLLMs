const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

const { Datasets } = require("../models/datasets");

function jobEndpoints(app) {
  if (!app) return;

  app.get(
    "/job/options",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      const result = {
        datasets: undefined,
        trainingMethods: undefined,
        baseModels: undefined,
        hyperparameters: undefined,
      };

      const datasetsPromise = Datasets.readAll();
      const trainingMethods = ["sft", "dpo"];
      const baseModels = [
        "LLAMA 2",
        "LLAMA 3",
        "microsoft/Phi-3-mini-4k-instruct",
      ];
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
      result.datasets = datasets;
      result.trainingMethods = trainingMethods;
      result.baseModels = baseModels;
      result.hyperparameters = hyperparameters;

      res.json(result);
    }
  );
}

module.exports = { jobEndpoints };
