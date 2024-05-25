import os
import sys
import torch

from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments,BitsAndBytesConfig
from datasets import load_dataset
from trl import SFTTrainer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

script_dir = os.path.dirname(os.path.abspath(__file__))
print(script_dir)
trainer_router_path = os.path.normpath(os.path.join(script_dir, "../../"))
print(trainer_router_path)
sys.path.append(trainer_router_path)
from trainer_router.settings import BASE_DIR


#############
# Pass args #
#############
output_dir="./results"
model_name ="NousResearch/Llama-2-7b-hf"

args = {}

if len(sys.argv) > 1:
    print(sys.argv)
    for arg in sys.argv[1:]:
        if arg.startswith('--'):
            kv = arg.split('=')
            k = kv[0][2:]
            v = '='.join(kv[1:])
            args[k] = v

print(args)

#TODO: think about how to safely pass in dataset
dataset_path = os.path.normpath(os.path.join(BASE_DIR, "../server/storage/datasets"))
print(dataset_path)

dataset = load_dataset("json", data_files=dataset_path, split="train")






import bitsandbytes as bnb
def find_all_linear_names(model):
    cls = bnb.nn.Linear4bit
    lora_module_names = set()
    for name, module in model.named_modules():
        if isinstance(module, cls):
            names = name.split('.')
            lora_module_names.add(names[0] if len(names) == 1 else names[-1])

    return list(lora_module_names)


def print_trainable_parameters(model):
  """
  Prints the number of trainable parameters in the model.
  """
  trainable_params = 0
  all_param = 0
  for _, param in model.named_parameters():
    all_param += param.numel()
    if param.requires_grad:
      trainable_params += param.numel()
  print(
      f"trainable params: {trainable_params} | all params: {all_param} | trainables%: {100 * trainable_params / all_param}"
  )
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

base_model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.bfloat16, quantization_config=bnb_config)
base_model.config.use_cache = False
base_model = prepare_model_for_kbit_training(base_model)

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"  # Fix weird overflow issue with fp16 training

# Change the LORA hyperparameters accordingly to fit your use case
peft_config = LoraConfig(
    r=128,
    lora_alpha=16,
    target_modules=find_all_linear_names(base_model),
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

base_model = get_peft_model(base_model, peft_config)
print_trainable_parameters(base_model)

def formatting_prompts_func(example):
    output_texts = []
    for i in range(len(example['prompt'])):
        text = f"An AI tool that corrects and rephrase user text grammar errors delimited by triple backticks to standard English.\n### Input: ```{example['prompt'][i]}```\n ### Output: {example['completion'][i]}"
        output_texts.append(text)
    return output_texts

# Parameters for training arguments details => https://github.com/huggingface/transformers/blob/main/src/transformers/training_args.py#L158
training_args = TrainingArguments(
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    gradient_checkpointing =True,
    max_grad_norm= 0.3,
    num_train_epochs=15, 
    learning_rate=2e-4,
    bf16=True,
    save_total_limit=3,
    logging_steps=10,
    output_dir=output_dir,
    optim="paged_adamw_32bit",
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
)

trainer = SFTTrainer(
    base_model,
    train_dataset=dataset,
    tokenizer=tokenizer,
    max_seq_length=2048,
    formatting_func=formatting_prompts_func,
    args=training_args
)

trainer.train() 
trainer.save_model(output_dir)

output_dir = os.path.join(output_dir, "final_checkpoint")
trainer.model.save_pretrained(output_dir)
tokenizer.save_pretrained(output_dir)