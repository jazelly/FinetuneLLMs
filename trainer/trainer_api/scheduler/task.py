import subprocess
import sys
import os
import time
import uuid

from django.conf import settings

from trainer_api.utils.errors import InvalidArgumentError
from trainer_api.utils.constants import (
    BASE_MODELS,
    FINETUNE_SCRIPT_DIR,
    TRAINING_METHODS,
)
from trainer_api.utils import logging

FINETUNE_SCRIPT_PATH = os.path.join(FINETUNE_SCRIPT_DIR, "./sft.py")


class Task:
    def __init__(self, **kwargs):
        self.id = uuid.uuid4()
        self.retried = 0
        self.max_retry = (
            kwargs["max_retry"] if "max_retry" in kwargs else 1
        )  # default retry once
        self.output = (
            kwargs["output"] if "output" in kwargs else sys.stdout
        )  # default retry once

        self.method = kwargs.get("method")
        if self.method is None:
            raise InvalidArgumentError(source=None, message="Missing method")
        self.model = kwargs.get("model")
        if self.model is None:
            raise InvalidArgumentError(source=None, message="Missing model")
        self.dataset = kwargs.get("dataset")
        if self.dataset is None:
            raise InvalidArgumentError(source=None, message="Missing dataset")
        self.training_args = kwargs.get("training_args")

    def run(self):
        if (
            self.method in map(lambda m: m["name"], TRAINING_METHODS)
            and self.model in BASE_MODELS
        ):
            command = self._assemble_command()
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            self._consume_logs_from_subprocess(process)
            process.wait()

    def _assemble_command(self):
        r = ["python", FINETUNE_SCRIPT_PATH]
        r.append("--model")
        r.append(f"{self.model}")
        r.append("--method")
        r.append(f"{self.method}")
        r.append("--dataset")
        r.append(f"{self.dataset}")
        return r

    def _consume_logs_from_subprocess(self, process):
        for pipe in (process.stdout, process.stderr):
            for line in iter(pipe.readline, b""):
                print(line)

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"
