from django.urls import path
from rest.controller import train

urlpatterns = [
    path("job/", train, name="train"),
]
