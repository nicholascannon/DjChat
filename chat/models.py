from django.db import models
from django.core.validators import MinLengthValidator
from uuid import uuid4


class Chat(models.Model):
    """
    A chat between two users.
    """

    uuid = models.UUIDField(default=uuid4, null=False)
    date_created = models.DateTimeField(auto_now_add=True, null=False)
    user1 = models.ForeignKey('users.User', null=False, related_name='user1',
                              on_delete=models.CASCADE)
    user2 = models.ForeignKey('users.User', null=False, related_name='user2',
                              on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'<Chat {self.uuid}>'


class ChatMessage(models.Model):
    """
    An individual message between two users in a chat. Messages must have at
    least one character.
    """

    uuid = models.UUIDField(default=uuid4, null=False)
    date_sent = models.DateTimeField(auto_now_add=True, null=False)
    message = models.CharField(max_length=300, null=False, validators=[
                               MinLengthValidator(1)])
    sender = models.ForeignKey('users.User', null=False, related_name='sender',
                               on_delete=models.CASCADE)
    chat = models.ForeignKey('Chat', null=False, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'<ChatMessage chat={self.chat.uuid} sender={self.sender.username}>'
