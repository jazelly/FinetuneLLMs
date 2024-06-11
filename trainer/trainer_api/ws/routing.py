from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("training/job/", consumers.TrainerConsumer.as_asgi()),
]
