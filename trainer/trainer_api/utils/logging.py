# coding=utf-8
""" Logging utilities."""


import functools
import logging
import os
import sys
import threading

from typing import Optional


_lock = threading.Lock()
_default_handler: Optional[logging.Handler] = None

log_levels = {
    "critical": logging.CRITICAL,
    "error": logging.ERROR,
    "warning": logging.WARNING,
    "info": logging.INFO,
    "debug": logging.DEBUG,
}

_default_log_level = logging.INFO


def _get_default_logging_level():
    """
    If TRAINER_VERBOSITY env var is set to one of the valid choices return that as the new default level. If it is
    not - fall back to `_default_log_level`
    """
    env_level_str = os.getenv("TRAINER_VERBOSITY", None)
    if env_level_str:
        if env_level_str in log_levels:
            return log_levels[env_level_str]
        else:
            logging.getLogger().warning(
                f"Unknown option TRAINER_VERBOSITY={env_level_str}, "
                f"has to be one of: { ', '.join(log_levels.keys()) }"
            )
    return _default_log_level


def _get_trainer_name() -> str:
    return __name__.split(".")[0]


def _get_trainer_root_logger() -> logging.Logger:
    return logging.getLogger(_get_trainer_name())


def _configure_trainer_root_logger() -> None:
    global _default_handler

    with _lock:
        if _default_handler:
            # This trainer has already configured the trainer root logger.
            return
        _default_handler = logging.StreamHandler()  # Set sys.stderr as stream.
        _default_handler.flush = sys.stderr.flush

        # Apply our default configuration to the trainer root logger.
        trainer_root_logger = _get_trainer_root_logger()
        trainer_root_logger.addHandler(_default_handler)
        trainer_root_logger.setLevel(_get_default_logging_level())
        trainer_root_logger.propagate = False


def get_log_levels_dict():
    return log_levels


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """
    Return a logger with the specified name.
    """

    if name is None:
        name = _get_trainer_name()

    _configure_trainer_root_logger()
    return logging.getLogger(name)


def get_verbosity() -> int:
    """
    Return the current level for the Trainer's root logger as an int.

    Returns:
        `int`: The logging level.

    <Tip>

    🤗 Trainer has following logging levels:

    - 50: `.logging.CRITICAL` or `.logging.FATAL`
    - 40: `.logging.ERROR`
    - 30: `.logging.WARNING` or `.logging.WARN`
    - 20: `.logging.INFO`
    - 10: `.logging.DEBUG`

    </Tip>"""

    _configure_trainer_root_logger()
    return _get_trainer_root_logger().getEffectiveLevel()


def set_verbosity(verbosity: int) -> None:
    """
    Set the verbosity level for the Trainer's root logger.

    Args:
        verbosity (`int`):
            Logging level, e.g., one of:

            - `.logging.CRITICAL` or `.logging.FATAL`
            - `.logging.ERROR`
            - `.logging.WARNING` or `.logging.WARN`
            - `.logging.INFO`
            - `.logging.DEBUG`
    """

    _configure_trainer_root_logger()
    _get_trainer_root_logger().setLevel(verbosity)


def disable_default_handler() -> None:
    """Disable the default handler of the HuggingFace Transformers's root logger."""

    _configure_trainer_root_logger()

    assert _default_handler is not None
    _get_trainer_root_logger().removeHandler(_default_handler)


def enable_default_handler() -> None:
    """Enable the default handler of the HuggingFace Transformers's root logger."""

    _configure_trainer_root_logger()

    assert _default_handler is not None
    _get_trainer_root_logger().addHandler(_default_handler)


def add_handler(handler: logging.Handler) -> None:
    """adds a handler to the HuggingFace Transformers's root logger."""

    _configure_trainer_root_logger()

    assert handler is not None
    _get_trainer_root_logger().addHandler(handler)


def remove_handler(handler: logging.Handler) -> None:
    """removes given handler from the HuggingFace Transformers's root logger."""

    _configure_trainer_root_logger()

    assert handler is not None and handler not in _get_trainer_root_logger().handlers
    _get_trainer_root_logger().removeHandler(handler)


def disable_propagation() -> None:
    """
    Disable propagation of the trainer log outputs. Note that log propagation is disabled by default.
    """

    _configure_trainer_root_logger()
    _get_trainer_root_logger().propagate = False


def enable_propagation() -> None:
    """
    Enable propagation of the trainer log outputs. Please disable the HuggingFace Transformers's default handler to
    prevent double logging if the root logger has been configured.
    """

    _configure_trainer_root_logger()
    _get_trainer_root_logger().propagate = True


def enable_explicit_format() -> None:
    """
    Enable explicit formatting for every HuggingFace Transformers's logger. The explicit formatter is as follows:
    ```
        [LEVELNAME|FILENAME|LINE NUMBER] TIME >> MESSAGE
    ```
    All handlers currently bound to the root logger are affected by this method.
    """
    handlers = _get_trainer_root_logger().handlers

    for handler in handlers:
        formatter = logging.Formatter(
            "[%(levelname)s|%(filename)s:%(lineno)s] %(asctime)s >> %(message)s"
        )
        handler.setFormatter(formatter)


def reset_format() -> None:
    """
    Resets the formatting for Trainer loggers.

    All handlers currently bound to the root logger are affected by this method.
    """
    handlers = _get_trainer_root_logger().handlers

    for handler in handlers:
        handler.setFormatter(None)


@functools.lru_cache(None)
def warning_once(self, *args, **kwargs):
    """
    This method is identical to `logger.warning()`, but will emit the warning with the same message only once

    Note: The cache is for the function arguments, so 2 different callers using the same arguments will hit the cache.
    The assumption here is that all warning messages are unique across the code. If they aren't then need to switch to
    another type of cache that includes the caller frame information in the hashing function.
    """
    self.warning(*args, **kwargs)


logging.Logger.warning_once = warning_once
