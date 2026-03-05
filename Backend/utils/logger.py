"""
Logging utility for the Processium backend.

Three capabilities:
    1. Console  — coloured terminal output          (get_logger)
    2. File     — rotating file handler              (get_file_logger)
    3. Database — audit trail in the audit_log table (log_audit)

Usage:
    from utils.logger import get_logger, get_file_logger, log_audit

    # Console
    logger = get_logger(__name__)
    logger.info("Something happened")

    # File
    file_logger = get_file_logger(__name__)
    file_logger.info("Written to logs/processium.log")

    # Database audit
    log_audit(
        entity_type="component",
        entity_id=some_uuid,
        action="create",
        performed_by=request.user.id,
        new_data={"name": "Widget"},
    )
"""

import json
import logging
import os
import sys
import uuid

from logging.handlers import RotatingFileHandler

from django.conf import settings
from django.db import connection


# =============================================================================
# Constants
# =============================================================================

ENTITY_TYPES = {
    "user",
    "component",
    "template",
    "template_snapshot",
    "workflow_instance",
    "workflow_instance_component",
    "workflow_instance_comment",
}

ACTIONS = {
    "create",
    "update",
    "delete",
    "status_change",
    "assign",
    "comment_add",
}


# =============================================================================
# Config
# =============================================================================

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

    # File handler defaults
    MAX_BYTES = 5 * 1024 * 1024  # 5 MB
    BACKUP_COUNT = 5


# =============================================================================
# 1. Console Logger
# =============================================================================

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
    Factory function that returns a configured logger with coloured console
    output.

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


# =============================================================================
# 2. File Logger
# =============================================================================

def get_file_logger(name, level=logging.DEBUG, log_file=None):
    """
    Factory function that returns a logger with a RotatingFileHandler.

    - Writes to *log_file* (default: settings.LOG_FILE or logs/processium.log).
    - No ANSI colours — plain text for easy grepping / tailing.
    - Rotates at 5 MB, keeps 5 backups.

    Args:
        name:     Logger name.
        level:    Logging level (default: logging.DEBUG).
        log_file: Explicit path; overrides the Django setting (useful in tests).

    Returns:
        logging.Logger instance.
    """
    if log_file is None:
        log_file = str(getattr(
            settings, "LOG_FILE",
            os.path.join(settings.BASE_DIR, "logs", "processium.log"),
        ))

    # Ensure the directory exists
    log_dir = os.path.dirname(log_file)
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)

    # Use a distinct namespace so console and file loggers don't collide
    logger_name = f"file.{name}"
    logger = logging.getLogger(logger_name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = RotatingFileHandler(
            log_file,
            maxBytes=LogConfig.MAX_BYTES,
            backupCount=LogConfig.BACKUP_COUNT,
        )
        handler.setLevel(level)
        formatter = logging.Formatter(LogConfig.FORMAT, datefmt=LogConfig.DATE_FORMAT)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    logger.propagate = False

    return logger


# =============================================================================
# 3. Database Audit Logger
# =============================================================================

_INSERT_SQL = """
    INSERT INTO audit_log (id, entity_type, entity_id, action,
                           old_data, new_data, performed_by)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""


def log_audit(entity_type, entity_id, action, performed_by,
              old_data=None, new_data=None):
    """
    Write an audit entry to the ``audit_log`` table.

    Args:
        entity_type:  One of ENTITY_TYPES (e.g. 'component').
        entity_id:    UUID of the affected entity.
        action:       One of ACTIONS (e.g. 'create').
        performed_by: UUID of the user who performed the action.
        old_data:     Optional dict — previous state (stored as JSON).
        new_data:     Optional dict — new state (stored as JSON).

    Raises:
        ValueError: If entity_type or action is not in the allowed set.
    """
    if entity_type not in ENTITY_TYPES:
        raise ValueError(
            f"Invalid entity_type '{entity_type}'. "
            f"Allowed: {sorted(ENTITY_TYPES)}"
        )
    if action not in ACTIONS:
        raise ValueError(
            f"Invalid action '{action}'. "
            f"Allowed: {sorted(ACTIONS)}"
        )

    row_id = str(uuid.uuid4())
    entity_id_str = str(entity_id)
    performed_by_str = str(performed_by) if performed_by else None
    old_json = json.dumps(old_data) if old_data is not None else None
    new_json = json.dumps(new_data) if new_data is not None else None

    with connection.cursor() as cur:
        cur.execute(_INSERT_SQL, [
            row_id,
            entity_type,
            entity_id_str,
            action,
            old_json,
            new_json,
            performed_by_str,
        ])
