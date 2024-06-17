import json
import subprocess
import sys
import os
import time
import uuid

from trainer_api.utils.errors import InvalidArgumentError
from trainer_api.utils.constants import (
    BASE_MODELS,
    FINETUNE_SCRIPT_PATH,
    TRAINING_METHODS,
)
from trainer_api.utils import logging

logger = logging.get_stream_logger("trainer_api.scheduler.task", "Task")


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
        self.ws = kwargs.get("ws")

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
        r = [
            "python",
            FINETUNE_SCRIPT_PATH,
            "--model",
            self.model,
            "--method",
            self.method,
            "--dataset",
            self.dataset,
        ]
        return r

    def _consume_logs_from_subprocess(self, process):
        for pipe in (process.stdout, process.stderr):
            for line in iter(pipe.readline, b""):
                if len(line) > 0:
                    logger.info(f"for ws: {line}")
                    self.ws.send_message_to_client_sync(
                        response=json.dumps(
                            {
                                "type": "info",
                                "message": "new log",
                                "data": {
                                    "task_id": str(self.id),
                                    "log": line,
                                },
                                "code": 200,
                            }
                        ),
                    )
                # else:
                #     logger.warning(f"an empty line: {line}")

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"
