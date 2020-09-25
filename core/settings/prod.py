from .base import *

ALLOWED_HOSTS = ['*']
DEBUG = False

DATABASES = {
    'default': {
    }
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
