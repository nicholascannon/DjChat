import json
from django.db.models import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Chat, ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_chat(self, chat_uuid, user):
        return Chat.objects.get(Q(uuid=chat_uuid), (Q(user1=user) | Q(user2=user)))

    @database_sync_to_async
    def create_message(self, message, sender, uuid):
        return ChatMessage.objects.create(message=message, uuid=uuid, sender=sender,
                                          chat=self.chat)

    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            user = self.scope['user']
            chat_uuid = self.scope['url_route']['kwargs'].get('chat_id')

            try:
                # authenticate user with chat
                self.chat = await self.get_chat(chat_uuid, user)
                self.room_name = f'chat.{chat_uuid}'

                # join channel group
                await self.channel_layer.group_add(self.room_name, self.channel_name)
                await self.accept()
            except Chat.DoesNotExist:
                await self.close()  # not a valid chat for this user -> close conn

    async def disconnect(self, code):
        # leave channel group if joined
        if hasattr(self, 'room_name'):
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        sender = self.scope['user']
        payload = json.loads(text_data)
        message = payload.get('message')
        uuid = payload.get('uuid')

        if not message or message.isspace():
            await self.send(json.dumps({'type': 'error', 'data': {'message': 'Please enter a message'}}))
        else:
            try:
                # create message then send to channel group
                msg_obj = await self.create_message(message, sender, uuid)

                await self.channel_layer.group_send(
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
                await self.send(json.dumps({
                    'type': 'error',
                    'data': {
                        'message': 'There was an error sending your message'
                    }
                }))

    async def chat_recieved(self, event):
        # ignore message if sent to self
        if self.channel_name != event['sender_channel_name']:
            await self.send(json.dumps({
                'type': 'chat_message',
                'data': {
                    'message': event['message'],
                    'uuid': event['uuid'],
                    'recieved': True
                }
            }))
