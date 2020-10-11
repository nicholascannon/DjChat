from rest_framework import permissions
from django.db.models import Q

from .models import Chat


class HasChatPermissions(permissions.BasePermission):
    """
    Checks if a user is apart of the chat passed in from the chat_uuid param.
    """

    message = 'Chat does not exist'
    code = 404

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            # try and get the chat uuid with the current user
            chat_uuid = request.resolver_match.kwargs.get('chat_uuid')
            Chat.objects.get(Q(uuid=chat_uuid) & (
                Q(user1=request.user) | Q(user2=request.user)))
            return True
        except Chat.DoesNotExist:
            return False
