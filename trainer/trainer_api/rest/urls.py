from django.urls import path
from trainer_api.rest.views import train

urlpatterns = [
    path("job/", train, name="train"),
]
