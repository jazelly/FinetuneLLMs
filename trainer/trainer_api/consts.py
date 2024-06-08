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


# A list of supported models
class Models(Enum):
    LLAMA2 = "LLAMA 2"
    LLAMA3 = "LLAMA 3"


# A list of supported training methods
class Methods(Enum):
    SFT = "sft"
    DPO = "dpo"


FINETUNE_SCRIPT_DIR = os.path.join(settings.BASE_DIR, "./trainer_api/finetune")


def convert_to_enum_name(text):
    return text.upper()
