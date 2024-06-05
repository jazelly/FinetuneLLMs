# Trainer in Django

Trainer is like a woker-like ASGI app that is intended to handle GPU training job.

## Quick Start

Python version `>=3.10`
Run on linux with Nvidia GPU, as it requires CUDA

```
pip install -r requirements.txt
daphne trainer.asgi:application
```

## Run Unit Tests

```
python manage.py test
```
