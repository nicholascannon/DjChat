from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4


class User(AbstractUser):
    """
    DjChat user model
    """

    uuid = models.UUIDField(default=uuid4)
    date_joined = models.DateField(auto_now_add=True)
