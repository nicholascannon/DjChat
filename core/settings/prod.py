from .base import *

ALLOWED_HOSTS = ['*']
DEBUG = False

DATABASES = {
    'default': {
    }
}

CORS_ALLOWED_ORIGINS = ['']
CSRF_TRUSTED_ORIGINS = ['']

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
