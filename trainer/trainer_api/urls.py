from django.urls import path
from .views import train_sft

urlpatterns = [
    path('sft/', train_sft, name='train-sft'),
]