from rest_framework import serializers

from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    recieved = serializers.SerializerMethodField('is_reciever')

    def is_reciever(self, obj):
        """
        Returns true if this chat message was recieved by the user getting the 
        messages.
        """
        user = self.context['request'].user
        return user != obj.sender

    class Meta:
        model = ChatMessage
        fields = ('uuid', 'date_sent', 'message', 'recieved')
