import subprocess
import sys
import uuid

from trainer_api.consts import Methods, Models

class Task:
    def __init__(self, **kwargs):
        self.id = uuid.uuid4()
        self.retried = 0
        self.max_retry = kwargs["max_retry"] if "max_retry" in kwargs else 1 # default retry once

    def run(self, log=sys.stdout):
        if self.method == Methods.SFT and self.model == Models.LLAMA2:
            subprocess.run(["python3", "../finetune/sft.py"], stdout=log, stderr=log, check=True)
    

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"