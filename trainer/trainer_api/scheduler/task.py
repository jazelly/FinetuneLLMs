import subprocess
import sys
import os
import time
import uuid

from django.conf import settings

from trainer_api.utils.errors import InvalidArgumentError
from trainer_api.utils.consts import FINETUNE_SCRIPT_DIR, Methods, Models
from trainer_api.utils import logging

logger = logging.get_logger(__name__)
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
        self.training_args = kwargs.get("training_args")

    @property
    def method(self) -> str:
        """
        `str`: Method. Log an error if used while not having been set.
        """
        if self.method is None:
            logger.error("Using method, but it is not set yet.")
            return None
        return str(self.method)

    @property
    def model(self) -> str:
        """
        `str`: Model. Log an error if used while not having been set.
        """
        if self.model is None:
            logger.error("Using model, but it is not set yet.")
            return None
        return str(self.model)

    def run(self, log=sys.stdout):
        command = self._assemble_command()
        if self.method == Methods.SFT and self.model == Models.LLAMA2:
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            self._consume_logs_from_subprocess(process)

    def _assemble_command(self):
        basic = ["python", FINETUNE_SCRIPT_PATH]

    def _consume_logs_from_subprocess(self, process):
        # Read the output continuously
        while True:
            # Read a line from stdout
            output = process.stdout.readline().strip()
            if output:
                # TODO: push to WS
                print(output)
                if self.output is not sys.stdout:
                    self.output.write(output)
            else:
                # Check if the process has finished
                return_code = process.poll()
                if return_code is not None:
                    break
                time.sleep(1)

        # Process has finished, read any remaining output
        remaining_output = process.stdout.read().strip()
        if remaining_output:
            print(remaining_output)
            if self.output is not sys.stdout:
                self.output.write(remaining_output)

        # Read the error output
        error_output = process.stderr.read().strip()
        if error_output:
            print(error_output)
            if self.output is not sys.stdout:
                self.output.write(error_output)

    def __str__(self):
        return f"[Task] method: {self.method if hasattr(self, 'method') else 'None'} training | model: {self.model if hasattr(self, 'model') else 'None'}"
