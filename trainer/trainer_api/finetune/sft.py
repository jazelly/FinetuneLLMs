import os
import sys
import torch
import argparse

print("[Training] starting training process")

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    pipeline,
)
from trl import SFTTrainer, SFTConfig, ORPOConfig, ORPOTrainer
from datasets import load_dataset
from peft import LoraConfig, PeftModel

script_dir = os.path.dirname(os.path.abspath(__file__))
trainer_root_path = os.path.normpath(os.path.join(script_dir, "../../"))
sys.path.append(trainer_root_path)


def check_bf16_compat():
    if compute_dtype == torch.float16 and use_4bit:
        major, _ = torch.cuda.get_device_capability()
        if major >= 8:
            print("=" * 40)
            print("Your GPU supports bfloat16")
            print("=" * 40)
            return True


#############
# Pass args #
#############


def process_args():
    # Create the parser
    parser = argparse.ArgumentParser(description="Training script parser")

    # Add arguments
    parser.add_argument("--model", type=str, dest="model", help="Set the name of model")
    parser.add_argument(
        "--dataset", type=str, dest="dataset", help="Set the name of dataset"
    )
    parser.add_argument(
        "--method", type=str, dest="method", help="Set the method to use"
    )

    # Parse the arguments
    args = parser.parse_args()

    return args


args = process_args()

method = args.method
if not method:
    print("[Warning] No training method provided, exiting")
    sys.exit(0)

# The model that you want to train from the Hugging Face hub
model_name = "NousResearch/Llama-2-7b-chat-hf"
# model_name = args.model
if not model_name:
    print("[Warning] No model provided, exiting")
    sys.exit(0)

# The instruction dataset to use
# dataset_name = "mlabonne/guanaco-llama2-1k"
dataset_name = "mlabonne/orpo-dpo-mix-40k"
# dataset_name = args.dataset
if not dataset_name:
    print("[Warning] No dataset provided, exiting")
    sys.exit(0)


# Output directory where the model predictions and checkpoints will be stored
MODEL_OUTPUT_DIR = os.path.join(script_dir, "results")
DATASET_CACHE_DIR = os.path.join(script_dir, "datasets")

# Number of training epochs
num_train_epochs = 1

# Enable fp16/bf16 training (set bf16 to True with an A100)
fp16 = False
bf16 = False

# Batch size per GPU for training
per_device_train_batch_size = 4

# Batch size per GPU for evaluation
per_device_eval_batch_size = 4

# Number of update steps to accumulate the gradients for
gradient_accumulation_steps = 1

# Enable gradient checkpointing
gradient_checkpointing = True

# Maximum gradient normal (gradient clipping)
max_grad_norm = 0.3

# Initial learning rate (AdamW optimizer)
learning_rate = 2e-4

# Weight decay to apply to all layers except bias/LayerNorm weights
weight_decay = 0.001

# Optimizer to use
optim = "paged_adamw_8bit"

# Learning rate schedule
lr_scheduler_type = "cosine"

# Number of training steps (overrides num_train_epochs)
max_steps = -1

# Ratio of steps for a linear warmup (from 0 to learning rate)
warmup_ratio = 0.03

# Group sequences into batches with same length
# Saves memory and speeds up training considerably
group_by_length = True

# Save checkpoint every X updates steps
save_steps = 0

# Log every X updates steps
logging_steps = 25

################################################################################
# SFT parameters
################################################################################

# Maximum sequence length to use
max_seq_length = 1024

# Pack multiple short examples in the same input sequence to increase efficiency
packing = False

# Load the entire model on the GPU 0
device_map = {"": 0}


# TODO: think about how to safely pass in dataset
# !!so far we can only support HF datasets!!
# dataset_path = os.path.normpath(os.path.join(BASE_DIR, "../server/storage/datasets"))
# print(dataset_path)


def get_dataset(name, split=None, cache_dir=DATASET_CACHE_DIR):
    return load_dataset(name, split=split, cache_dir=cache_dir)


def get_tokenizer(model_name):
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"  # Fix weird overflow issue with fp16 training
    return tokenizer


tokenizer = get_tokenizer(model_name)

################################################################################
# QLoRA parameters
################################################################################

# LoRA attention dimension
lora_r = 64

# Alpha parameter for LoRA scaling
lora_alpha = 16

# Dropout probability for LoRA layers
lora_dropout = 0.1


def get_lora_config(lora_alpha, lora_dropout, lora_r):
    return LoraConfig(
        lora_alpha=lora_alpha,
        lora_dropout=lora_dropout,
        r=lora_r,
        bias="none",
        task_type="CAUSAL_LM",
    )


peft_config = get_lora_config(
    lora_alpha=lora_alpha, lora_dropout=lora_dropout, lora_r=lora_r
)

################################################################################
# bitsandbytes parameters
################################################################################

# Activate 4-bit precision base model loading
use_4bit = True

# Compute dtype for 4-bit base models
bnb_4bit_compute_dtype = "float16"

# Quantization type (fp4 or nf4)
bnb_4bit_quant_type = "nf4"

# Activate nested quantization for 4-bit base models (double quantization)
use_nested_quant = False

# Load tokenizer and model with QLoRA configuration
compute_dtype = getattr(torch, bnb_4bit_compute_dtype)


def get_base_model_bnb_config():
    # Quantization config
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=use_4bit,
        bnb_4bit_quant_type=bnb_4bit_quant_type,
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=use_nested_quant,
    )

    return bnb_config


bnb_config = get_base_model_bnb_config()


def get_quantized_model(model_name, quantization_config, device_map):
    # Load base model
    model = AutoModelForCausalLM.from_pretrained(
        model_name, quantization_config=quantization_config, device_map=device_map
    )
    model.config.use_cache = False  # whether the model uses caching during inference to speed up generation by reusing previous computations
    model.config.pretraining_tp = 1
    return model


model = get_quantized_model(model_name, bnb_config, device_map)

dataset = get_dataset(name=dataset_name, cache_dir=DATASET_CACHE_DIR)
training_set = dataset["train"]


if (
    method == "orpo"
    and training_set.features is not None
    and "prompt" not in training_set.features
    and "chosen" not in training_set.features
    and "rejected" not in training_set.features
):
    print(
        f"[Warning] the dataset {dataset_name} is not suitable for the chosen method {method.upper()}"
    )
    sys.exit(0)


def format_chat_template(row):
    if method == "orpo":
        row["chosen"] = tokenizer.apply_chat_template(row["chosen"], tokenize=False)
        row["rejected"] = tokenizer.apply_chat_template(row["rejected"], tokenize=False)
    return row


training_set_formatted = training_set.map(
    format_chat_template,
    num_proc=os.cpu_count(),
)


def get_new_model_name():
    return f"{model_name}-{dataset_name}"


################################################################################
# TrainingArguments parameters
################################################################################
# Parameters for training arguments details => https://github.com/huggingface/transformers/blob/main/src/transformers/training_args.py#L158
def get_training_args_of_method(method: str):
    if method == "sft":
        training_arguments = SFTConfig(
            output_dir=MODEL_OUTPUT_DIR,
            max_seq_length=max_seq_length,
            dataset_text_field="text",
            num_train_epochs=num_train_epochs,
            per_device_train_batch_size=per_device_train_batch_size,
            gradient_accumulation_steps=gradient_accumulation_steps,
            optim=optim,
            save_steps=save_steps,
            logging_steps=logging_steps,
            learning_rate=learning_rate,
            weight_decay=weight_decay,
            fp16=fp16,
            bf16=bf16,
            max_grad_norm=max_grad_norm,
            max_steps=max_steps,
            warmup_ratio=warmup_ratio,
            group_by_length=group_by_length,
            lr_scheduler_type=lr_scheduler_type,
            # report_to="tensorboard",
        )
        return training_arguments
    elif method == "orpo":
        training_arguments = ORPOConfig(
            learning_rate=learning_rate,
            beta=0.1,
            lr_scheduler_type="linear",
            max_length=1024,
            max_prompt_length=512,
            per_device_train_batch_size=2,
            per_device_eval_batch_size=2,
            gradient_accumulation_steps=4,
            optim=optim,
            num_train_epochs=1,
            eval_strategy="steps",
            eval_steps=0.2,
            logging_steps=1,
            warmup_steps=10,
            output_dir=MODEL_OUTPUT_DIR,
            remove_unused_columns=False,
        )
        return training_arguments


def get_trainer(
    model,
    train_dataset,
    peft_config,
    tokenizer,
    method,
):
    training_arguments = get_training_args_of_method(method)
    if method == "sft":
        trainer = SFTTrainer(
            model=model,
            train_dataset=train_dataset,
            peft_config=peft_config,
            tokenizer=tokenizer,
            args=training_arguments,
        )
        return trainer
    elif method == "orpo":
        trainer = ORPOTrainer(
            model=model,
            args=training_arguments,
            train_dataset=train_dataset,
            peft_config=peft_config,
            tokenizer=tokenizer,
        )
        return trainer


trainer = get_trainer(
    model=model,
    train_dataset=training_set_formatted if method == "orpo" else training_set,
    peft_config=peft_config,
    tokenizer=tokenizer,
    method=method,
)


# Fine-tuned model name
new_model = get_new_model_name()


def train(trainer):
    # Train model
    trainer.train()
    # Save trained model
    trainer.model.save_pretrained(new_model)


def get_gpu_memory():
    if not torch.cuda.is_available():
        return "No GPU available"

    total_memory = torch.cuda.get_device_properties(0).total_memory
    free_memory = torch.cuda.memory_reserved(0)

    return total_memory, free_memory


total_memory, free_memory = get_gpu_memory()

print(f"Free Memory {free_memory} / Total Memory {total_memory}")


def get_model_parameters(model):
    # Extract model architecture parameters
    num_parameters = sum(
        p.numel() for p in model.parameters()
    )  # Total number of parameters
    batch_size = 1  # Batch size is typically 1 during model loading
    seq_length = 128  # Default sequence length used during model loading
    hidden_size = model.config.hidden_size  # Hidden size of the model
    num_layers = model.config.num_hidden_layers  # Number of layers in the model

    return {
        "num_parameters": num_parameters,
        "batch_size": batch_size,
        "seq_length": seq_length,
        "hidden_size": hidden_size,
        "num_layers": num_layers,
    }


model_params = get_model_parameters(model)
print(get_model_parameters(model))


def calculate_memory_requirements(
    quantization_bit, num_parameters, batch_size, seq_length, hidden_size, num_layers
):
    bits_per_float = quantization_bit
    model_params_memory = num_parameters * bits_per_float // 8
    gradients_memory = num_parameters * bits_per_float // 8
    optimizer_memory = num_parameters * bits_per_float * 2 // 8
    activations_per_layer = batch_size * seq_length * hidden_size
    total_activations = activations_per_layer * num_layers
    activations_memory = total_activations * bits_per_float // 8
    total_memory = (
        model_params_memory + gradients_memory + optimizer_memory + activations_memory
    )
    return {
        "model_params_memory": model_params_memory,
        "gradients_memory": gradients_memory,
        "optimizer_memory": optimizer_memory,
        "activations_memory": activations_memory,
        "total_memory": total_memory,
    }


estimated_training_memory_usage = calculate_memory_requirements(4, **model_params)
print(f"Training model requires {estimated_training_memory_usage}")
if estimated_training_memory_usage["total_memory"] > free_memory:
    print(
        f"Estimated: require at least {estimated_training_memory_usage['total_memory'] // 1e6} MB, but only have {free_memory//1e6} MB left."
    )
    sys.exit(0)

train(trainer)

# %load_ext tensorboard
# %tensorboard --logdir results/runs

# Run text generation pipeline with our next model
prompt = "What is a large language model?"
pipe = pipeline(
    task="text-generation", model=model, tokenizer=tokenizer, max_length=200
)
result = pipe(f"<s>[INST] {prompt} [/INST]")
print(result[0]["generated_text"])

del model
del pipe
del trainer
import gc

gc.collect()
gc.collect()


def save_trained_model():
    # Reload model in FP16 and merge it with LoRA weights
    base_model = AutoModelForCausalLM.from_pretrained(
        model_name,
        low_cpu_mem_usage=True,
        return_dict=True,
        torch_dtype=torch.float16,
        device_map=device_map,
    )
    model = PeftModel.from_pretrained(base_model, new_model)
    model = model.merge_and_unload()


save_trained_model()

saved_tokenizer = tokenizer.save_pretrained(new_model)
