from rest_framework import serializers

from .models import ChatMessage, Chat
from users.serializers import UserSerializer
from users.models import User


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


class ChatSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField('get_other_user')
    recipient = serializers.CharField(max_length=150, write_only=True)

    def get_other_user(self, obj):
        """
        Returns the other users model.
        """
        if obj.user1_id == self.context['request'].user.id:
            return UserSerializer(obj.user2).data

        return UserSerializer(obj.user1).data

    def validate_recipient(self, recipient):
        """
        Checks if recipient is a valid user. 
        """
        try:
            User.objects.get(username=recipient)
            return recipient
        except User.DoesNotExist:
            raise serializers.ValidationError(f'Invalid user {recipient}')

    class Meta:
        model = Chat
        fields = ('uuid', 'date_created', 'user', 'recipient')
        read_only_fields = ('uuid',)
