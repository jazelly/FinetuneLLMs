import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit
import subprocess

from trainer_api.consts import Methods, Models
from trainer_api.scheduler.worker import Worker

@csrf_exempt
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def train_sft(request):
    if request.method == 'POST':
        # potentially all the configs for tune job
        if request.body:
            body_json = json.loads(request.body)
        # schedule the task
        worker = Worker()
        worker.add_task(method = Methods.SFT, model = Models.LLAMA2)
        return JsonResponse({"status": "success", "message": "Added task to queue"})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."})
