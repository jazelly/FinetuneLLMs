from django.urls import path
from . import consumers, chat

websocket_urlpatterns = [
    path("training/job/", consumers.TrainingConsumer.as_asgi()),
    path("inference/", chat.ChatConsumer.as_asgi()),
]
