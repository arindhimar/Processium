import uuid
from django.db import models
from django.db.models import Func

class GenRandomUUID(Func):
    function = 'gen_random_uuid'
    output_field = models.UUIDField()

    