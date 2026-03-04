from .base import *

# DEBUG and ALLOWED_HOSTS are read from .env via base.py
# For local, .env sets DEBUG=True and ALLOWED_HOSTS=localhost,127.0.0.1

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOW_ALL_ORIGINS = True

