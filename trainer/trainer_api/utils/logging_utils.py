import json
import logging
import sys
from io import StringIO
from typing import Callable


# Custom class to intercept stdout
class StdoutInterceptor:
    def __init__(self, logger_name):
        self.original_stdout = sys.stdout  # Save the original stdout
        self.buffer = StringIO()
        self.logger_name = logger_name

    def write(self, message):
        self.original_stdout.write(f"{self.logger_name}:\n{message}\n")  # Custom action
        self.buffer.write(message)  # Save the original message

    def flush(self):
        self.original_stdout.flush()
        self.buffer.flush()

    def get_value(self):
        return self.buffer.getvalue()


def get_stream_logger(name: str, level=logging.INFO):
    # Create a custom logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create handlers (console handler in this example)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(level)

    # Create formatter with the custom prefix
    formatter = logging.Formatter(f"[{name}] %(asctime)s - %(levelname)s - %(message)s")

    # Add the formatter to the handler
    ch.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(ch)

    return logger
