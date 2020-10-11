from rest_framework.generics import ListAPIView

from .models import ChatMessage
from .serializers import ChatMessageSerializer
from .permissions import HasChatPermissions


class ChatMessageListView(ListAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        """
        Filter chat messages by requested chat
        """
        return ChatMessage.objects.filter(chat__uuid=self.kwargs['chat_uuid']).order_by('-date_sent')
