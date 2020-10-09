import json
from django.core.checks import messages
from django.db.models import Q
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .models import Chat, ChatMessage


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        if self.scope['user'].is_anonymous:
            self.close()
        else:
            user = self.scope['user']
            chat_uuid = self.scope['url_route']['kwargs'].get('chat_id')

            try:
                # authenticate user with chat
                self.chat = Chat.objects.get(
                    Q(uuid=chat_uuid) & (Q(user1=user) | Q(user2=user)))
                self.room_name = f'chat.{chat_uuid}'

                # join channel group
                async_to_sync(self.channel_layer.group_add)(
                    self.room_name, self.channel_name)

                self.accept()
            except Chat.DoesNotExist:
                self.close()  # not a valid chat for this user -> close conn

    def disconnect(self, code):
        # leave channel group if joined
        if hasattr(self, 'room_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_name, self.channel_name
            )

    def receive(self, text_data):
        sender = self.scope['user']
        payload = json.loads(text_data)
        message = payload.get('message')

        if not message:
            self.send(json.dumps({'error': 'No message'}))
        else:
            try:
                # create message then send to channel group
                msg_obj = ChatMessage.objects.create(
                    message=message, sender=sender, chat=self.chat)
                async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        'type': 'chat_recieved',
                        'message': message,
                        'uuid': str(msg_obj.uuid),
                        'sender_channel_name': self.channel_name,
                    }
                )
            except Exception as e:
                # TODO: log error here
                self.send(json.dumps(
                    {'error': 'There was an error sending your message'}))

    def chat_recieved(self, event):
        # ignore message if sent to self
        if self.channel_name != event['sender_channel_name']:
            self.send(json.dumps({
                'message': event['message'],
                'uuid': event['uuid'],
                'recieved': True
            }))
