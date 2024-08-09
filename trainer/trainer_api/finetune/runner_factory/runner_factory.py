from trainer_api.reporter.reporter import TrainerReporter
from .runner_config import device_map
import torch
from trl import PPOConfig, PPOTrainer, AutoModelForCausalLMWithValueHead
from typing import Dict
from transformers import AutoTokenizer
from datasets import load_dataset
from functools import partial
from transformers import pipeline


class RunnerFactory:
    def createTrainer(model: str):
        ...

class AbstractRunner:
    def __init__(
            self,
            task_id: str,
            reporter: TrainerReporter,
            dataset: str,
            # runner_config: Dict
        ):
        self.id: str = task_id
        self.reporter: TrainerReporter = reporter
        self.dataset: str = dataset
        # self.runner_config: Dict = runner_config

    def report(self, log):
        print(log)
        if not self.reporter:
            return
        self.reporter.report(log)

    def get_gpu_memory(self):
        print(device_map.type)
        if not device_map.type.startswith("cuda"):
            return 0, 0
        if not torch.cuda.is_available():
            return -1, -1

        total_memory = torch.cuda.get_device_properties(0).total_memory
        free_memory = torch.cuda.memory_reserved(0)

        return total_memory, free_memory
    
    def train(self):
        ...

    

class PPORunner(AbstractRunner):
    
    def train(self):
        config = PPOConfig(
            model_name="gpt2",
            learning_rate=1.41e-5,
        )
        model = AutoModelForCausalLMWithValueHead.from_pretrained(config.model_name)
        tokenizer = AutoTokenizer.from_pretrained(config.model_name)
        tokenizer.pad_token = tokenizer.eos_token
        dataset = load_dataset("HuggingFaceH4/cherry_picked_prompts", split="train")
        dataset = dataset.rename_column("prompt", "query")
        dataset = dataset.remove_columns(["meta", "completion"])
        def tokenize(sample):
            print(f"{tokenizer=}, {sample=}", flush=True)
            sample["input_ids"] = tokenizer.encode(sample["query"])

            return sample
        dataset = dataset.map(tokenize, batched=False, num_proc=None)
        import sys
        sys.exit()
        ppo_trainer = PPOTrainer(
            model=model,
            config=config,
            dataset=dataset,
            tokenizer=tokenizer,
        )
        reward_model = pipeline("text-classification", model="lvwerra/distilbert-imdb")
        from tqdm import tqdm
        epochs = 10
        generation_kwargs = {
            "min_length": -1,
            "top_k": 0.0,
            "top_p": 1.0,
            "do_sample": True,
            "pad_token_id": tokenizer.eos_token_id,
        }
        for epoch in tqdm(range(epochs), "epoch: "):
            for batch in tqdm(ppo_trainer.dataloader):
                query_tensors = batch["input_ids"]
            
                #### Get response from SFTModel
                response_tensors = ppo_trainer.generate(query_tensors, **generation_kwargs)
                batch["response"] = [tokenizer.decode(r.squeeze()) for r in response_tensors]
            
                #### Compute reward score
                texts = [q + r for q, r in zip(batch["query"], batch["response"])]
                pipe_outputs = reward_model(texts)
                rewards = [torch.tensor(output[1]["score"]) for output in pipe_outputs]
            
                #### Run PPO step
                stats = ppo_trainer.step(query_tensors, response_tensors, rewards)
                ppo_trainer.log_stats(stats, batch, rewards)

        #### Save model
        ppo_trainer.save_pretrained("my_ppo_model")

# def tokenize(sample, tokenizer, ):
#     print(f"{tokenizer=}, {sample=}")
#     sample["input_ids"] = tokenizer.encode(sample["query"])

#     return sample
