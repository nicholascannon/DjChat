from rest_framework import serializers
from rest_framework.exceptions import APIException
from logging import getLogger

from .models import ChatMessage, Chat
from users.serializers import UserSerializer
from users.models import User


logger = getLogger('chat_serializers')


class ChatMessageSerializer(serializers.ModelSerializer):
    recieved = serializers.SerializerMethodField('is_reciever')

    def is_reciever(self, obj):
        """
        Returns true if this chat message was recieved by the user getting the 
        messages.
        """
        try:
            user = self.context['request'].user
            return user != obj.sender
        except KeyError:
            logger.exception('Request not passed to context')
            raise APIException()

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
        try:
            if obj.user1_id == self.context['request'].user.id:
                return UserSerializer(obj.user2).data

            return UserSerializer(obj.user1).data
        except KeyError:
            logger.exception('Request not passed to context')
            raise APIException()

    def validate_recipient(self, recipient):
        """
        Checks if recipient is a valid user. 
        """
        try:
            return User.objects.get(username=recipient)
        except User.DoesNotExist:
            raise serializers.ValidationError(f'Invalid user {recipient}')
        except Exception as e:
            logger.exception('Recipient validation error')
            raise APIException('Could not validated chat recipient', 500)

    def create(self, validated_data):
        user1 = self.context['request'].user
        user2 = validated_data['recipient']
        return Chat.objects.create(user1=user1, user2=user2)

    class Meta:
        model = Chat
        fields = ('uuid', 'date_created', 'user', 'recipient')
        read_only_fields = ('uuid', 'date_created', 'user')
