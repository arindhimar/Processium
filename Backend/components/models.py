import uuid
from django.db import models


class Component(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    schema = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'component'
        ordering = ['-created_at']


class RatingScale(models.Model):
    """
    Configurable rating scale entries.
    Stored in DB so they can be updated without code changes.
    e.g. 1-Below Average, 2-Average, 3-Acceptable, 4-Excellent, 5-Outstanding
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    value = models.IntegerField(unique=True, help_text="Numeric rating value (e.g. 1, 2, 3)")
    label = models.CharField(max_length=100, help_text="Short label (e.g. 'Excellent')")
    description = models.CharField(max_length=255, blank=True, default='', help_text="Detailed description")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.value} - {self.label}"

    class Meta:
        db_table = 'rating_scale'
        ordering = ['value']


class ScoringParameter(models.Model):
    """
    Configurable scoring parameters for interview rounds.
    e.g. Communication, Confidence, Problem Solving, etc.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'scoring_parameter'
        ordering = ['name']

