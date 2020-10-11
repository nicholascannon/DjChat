from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import ChatMessage, Chat
from .serializers import ChatMessageSerializer, ChatSerializer
from .permissions import HasChatPermissions


class ChatMessageListView(ListAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        """
        Filter chat messages by requested chat
        """
        return (ChatMessage.objects.filter(chat__uuid=self.kwargs['chat_uuid'])
                .order_by('-date_sent'))


class ChatListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.filter(Q(user1=self.request.user) | Q(user1=self.request.user))
