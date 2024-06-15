from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("training/job/", consumers.TrainingConsumer.as_asgi()),
]
