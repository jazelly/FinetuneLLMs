from enum import Enum
import os

from django.conf import settings

"""
Scheduler scope
"""
MAX_IDLE_TIME = 5000


class WorkerStates(Enum):
    IDLE = 0
    BUSY = 1
    DONE = 2
    ERROR = 3


FINETUNE_SCRIPT_DIR = os.path.join(settings.BASE_DIR, "./trainer_api/finetune")
FINETUNE_SCRIPT_PATH = os.path.join(FINETUNE_SCRIPT_DIR, "./sft.py")

LOG_DIR = log_path = os.path.join(settings.BASE_DIR, "trainer_api/logs/")


def convert_to_enum_name(text):
    return text.upper()


BASE_MODELS = [
    "NousResearch/Llama-2-7b-chat-hf",
    "NousResearch/Meta-Llama-3-8B",
    "microsoft/Phi-3-mini-4k-instruct",
]

TRAINING_METHODS = [
    {
        "name": "SFT",
        "full_name": "Supervised Fine-Tuning",
        "explanation": "SFT is the process of adapting a pre-trained model to a specific task using labeled data.",
        "external_link": "https://huggingface.co/docs/trl/main/en/sft_trainer",
    },
    {
        "name": "ORPO",
        "full_name": "Odds Ratio Preference Optimization",
        "explanation": "Odds Ratio Preference Optimization (ORPO) by Jiwoo Hong, Noah Lee, and James Thorne studies the crucial role of SFT within the context of preference alignment. "
        + "Using preference data the method posits that a minor penalty for the disfavored generation together with a strong adaption signal to the chosen response via a simple "
        + "log odds ratio term appended to the NLL loss is sufficient for preference-aligned SFT.",
        "external_link": "https://huggingface.co/docs/trl/main/en/orpo_trainer",
    },
]

EXAMPLE_DATASETS = [
    {
        "name": "mlabonne/orpo-dpo-mix-40k",
        "features": ["source", "chosen", "rejected", "prompt", "question"],
        "num_rows": 40000,
    },
    {"name": "mlabonne/guanaco-llama2-1k", "features": ["text"], "num_rows": 1000},
    {
        "name": "soulhq-ai/insuranceQA-v2",
        "features": ["input", "output"],
        "num_rows": 21300,
    },
]
