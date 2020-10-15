from rest_framework.generics import ListAPIView, ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import ChatMessage, Chat
from .serializers import ChatMessageSerializer, ChatSerializer
from .permissions import HasChatPermissions


class ChatMessageListView(ListAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        return ChatMessage.objects.filter(chat__uuid=self.kwargs['chat_uuid']).order_by('-date_sent')


class ChatListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.filter(Q(user1=self.request.user) | Q(user2=self.request.user))


class ChatDestroyView(DestroyAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatSerializer
    lookup_field = 'uuid'
    lookup_url_kwarg = 'chat_uuid'

    def get_queryset(self):
        return Chat.objects.filter(Q(user1=self.request.user) | Q(user2=self.request.user))
