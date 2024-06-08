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
        if self.method == Methods.SFT and self.model == Models.LLAMA2:
            process = subprocess.Popen(
                ["python", FINETUNE_SCRIPT_PATH],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            self._consume_logs_from_subprocess(process)

    def _consume_logs_from_subprocess(self, process):
        # Read the output continuously
        while True:
            # Read a line from stdout
            output = process.stdout.readline().strip()
            if output:
                # TODO: push to WS
                print(output)
            else:
                # Check if the process has finished
                return_code = process.poll()
                if return_code is not None:
                    break

        # Process has finished, read any remaining output
        remaining_output = process.stdout.read().strip()
        if remaining_output:
            print(remaining_output)

        # Read the error output
        error_output = process.stderr.read().strip()
        if error_output:
            print(error_output)

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"
