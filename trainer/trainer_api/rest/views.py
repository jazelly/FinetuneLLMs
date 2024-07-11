import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit

from trainer_api.utils.logging import get_stream_logger
from trainer_api.utils.constants import BASE_MODELS, TRAINING_METHODS
from trainer_api.scheduler.task import Task
from trainer_api.scheduler.worker import Worker

logger = get_stream_logger("trainer_api.views", "Trainer Views")


@csrf_exempt
@ratelimit(key="ip", rate="30/m", method="POST", block=True)
def train(request):
    if request.method == "POST":
        # potentially all the configs for tune job
        if request.body:
            body_json = json.loads(request.body)
            logger.info("body_json", body_json)
            if (
                body_json["trainingMethod"]
                in map(lambda m: m["name"], TRAINING_METHODS)
                and body_json.get("baseModel") in BASE_MODELS
                and body_json.get("dataset") is not None
                and body_json["dataset"].get("name") is not None
            ):
                try:
                    # schedule the task and repond immediately
                    logger.info("[Worker] Submitting task")
                    worker = Worker()

                    t = Task(
                        method=body_json["trainingMethod"],
                        model=body_json["baseModel"],
                        dataset=body_json["dataset"]["name"],
                    )
                    worker.submit(t)

                    return JsonResponse(
                        {
                            "status": "success",
                            "message": "Added task to queue",
                            "data": {
                                "task_id": t.id,
                            },
                        },
                        status=200,
                    )
                except Exception as e:
                    logger.error(e)
                    return JsonResponse(
                        {"status": "error", "message": f"An error occurred: {e}" },
                        status=500,
                    )
        return JsonResponse({"status": "success", "message": "noop"}, status=201)
    else:
        return JsonResponse(
            {"status": "error", "message": "Invalid request method."}, status=400
        )
