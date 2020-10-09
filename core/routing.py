from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

import chat.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(  # populates conn scope with auth'd user
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
