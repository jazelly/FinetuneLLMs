import uuid
from trainer_api.finetune.sft import SFTRunner
from trainer_api.finetune.runner_factory import PPORunner

if __name__ == "__main__":
    model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    method = "sft"
    dataset = "soulhq-ai/insuranceQA-v2"
    r = PPORunner("TinyLlama/TinyLlama-1.1B-Chat-v1.0", "sft", "soulhq-ai/insuranceQA-v2")
    r.train()
    # r = SFTRunner(uuid.uuid4(), None)
    # r.run(model, method, dataset, None)
