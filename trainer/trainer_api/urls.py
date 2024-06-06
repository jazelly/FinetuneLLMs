from django.urls import path
from .views import train

urlpatterns = [
    path("job/", train, name="train"),
]
