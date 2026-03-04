"""
Logging utility for the Processium backend.

Usage:
    from utils.logger import get_logger
    logger = get_logger(__name__)

    logger.debug("Debugging info")
    logger.info("Something happened")
    logger.warning("Watch out")
    logger.error("Something went wrong")
    logger.critical("System is down")
"""

import logging
import sys


class LogConfig:
    """Central logging configuration."""

    FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

    LEVELS = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL,
    }


class ColorFormatter(logging.Formatter):
    """Adds ANSI color codes to log level names for terminal output."""

    COLORS = {
        logging.DEBUG: "\033[36m",      # Cyan
        logging.INFO: "\033[32m",       # Green
        logging.WARNING: "\033[33m",    # Yellow
        logging.ERROR: "\033[31m",      # Red
        logging.CRITICAL: "\033[1;31m", # Bold Red
    }
    RESET = "\033[0m"

    def format(self, record):
        color = self.COLORS.get(record.levelno, self.RESET)
        record.levelname = f"{color}{record.levelname}{self.RESET}"
        return super().format(record)


def get_logger(name, level=logging.DEBUG):
    """
    Factory function that returns a configured logger.

    - Creates a StreamHandler (stdout) with colored output.
    - Prevents duplicate handlers if called multiple times with the same name.
    - Default level is DEBUG so all messages are captured during development.

    Args:
        name:  Logger name, typically __name__ of the calling module.
        level: Logging level (default: logging.DEBUG).

    Returns:
        logging.Logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid adding duplicate handlers on repeated calls
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(level)
        formatter = ColorFormatter(LogConfig.FORMAT, datefmt=LogConfig.DATE_FORMAT)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    # Prevent log propagation to root logger (avoids double output)
    logger.propagate = False

    return logger
