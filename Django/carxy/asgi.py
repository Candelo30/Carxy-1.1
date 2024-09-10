import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from .consumers import LikeDislikeConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "carxy.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                [
                    path("ws/likes/", LikeDislikeConsumer.as_asgi()),
                ]
            ),
        ),
    }
)
