from django.urls import path
from trainer_api.rest.controller import train

urlpatterns = [
    path("job/", train, name="train"),
]
