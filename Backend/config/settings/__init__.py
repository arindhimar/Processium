import os

DJANGO_ENV = os.environ.get('DJANGO_ENV', 'local')

if DJANGO_ENV == 'production':
    from .production import *
else:
    from .local import *
