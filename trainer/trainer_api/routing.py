from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("training/job/", consumers.MyConsumer.as_asgi()),
]
