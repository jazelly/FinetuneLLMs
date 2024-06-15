import logging
import sys


def get_stream_logger(name: str, prefix: str, level=logging.INFO):
    # Create a custom logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create handlers (console handler in this example)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(level)

    # Create formatter with the custom prefix
    formatter = logging.Formatter(
        f"[{prefix}] %(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Add the formatter to the handler
    ch.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(ch)

    return logger


def get_file_logger(name, prefix, log_file, level=logging.INFO):
    # Create a custom logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create a file handler
    fh = logging.FileHandler(log_file)
    fh.setLevel(level)

    # Create formatter with the custom prefix
    formatter = logging.Formatter(
        f"{prefix} %(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Add the formatter to the handler
    fh.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(fh)

    return logger
