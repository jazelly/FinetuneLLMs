from enum import Enum

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
    LLAMA2 = "llama2"
    LLAMA3 = "llama3"

# A list of supported training methods
class Methods(Enum):
    SFT = "sft"
    DPO = "dpo"
