import subprocess
import sys
import os
import uuid

from django.conf import settings

from trainer_api.errors import InvalidArgumentError
from trainer_api.consts import FINETUNE_SCRIPT_DIR, Methods, Models


FINETUNE_SCRIPT_PATH = os.path.join(FINETUNE_SCRIPT_DIR, "./sft.py")


class Task:
    def __init__(self, **kwargs):
        self.id = uuid.uuid4()
        self.retried = 0
        self.max_retry = (
            kwargs["max_retry"] if "max_retry" in kwargs else 1
        )  # default retry once
        self.method = kwargs.get("method")
        if self.method is None:
            raise InvalidArgumentError(source=None, message="Missing method")
        self.model = kwargs.get("model")
        if self.model is None:
            raise InvalidArgumentError(source=None, message="Missing model")

    def run(self, log=sys.stdout):
        print(self.method)
        print(self.model)
        if self.method == Methods.SFT.value and self.model == Models.LLAMA2.value:
            subprocess.run(
                ["python", FINETUNE_SCRIPT_DIR], stdout=log, stderr=log, check=True
            )

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"
