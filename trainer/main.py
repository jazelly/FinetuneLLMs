import uuid
from trainer_api.finetune.sft import SFTRunner

if __name__ == "__main__":
    model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    method = "sft"
    dataset = "soulhq-ai/insuranceQA-v2"
    r = SFTRunner(uuid.uuid4(), None)
    r.run(model, method, dataset, None)
