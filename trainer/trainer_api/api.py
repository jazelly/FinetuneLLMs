from ninja import NinjaAPI, Schema
from typing import Dict, Any, List, Optional
import json
import uuid

from trainer_api.scheduler.task import Task
from trainer_api.scheduler.worker import Worker
from trainer_api.utils.constants import BASE_MODELS, TRAINING_METHODS
from trainer_api.utils import logging_utils

api_logger = logging_utils.get_stream_logger("api")

api = NinjaAPI()


class TrainingRequest(Schema):
    trainingMethod: str
    baseModel: str
    datasetName: str


class TaskResponse(Schema):
    task_id: str


class SuccessResponse(Schema):
    status: str = "success"
    message: str
    data: Optional[TaskResponse] = None


class ErrorResponse(Schema):
    status: str = "error"
    message: str
    code: int = 400


@api.post(
    "/job", response={200: SuccessResponse, 400: ErrorResponse, 500: ErrorResponse}
)
def train(request, data: TrainingRequest):
    api_logger.info(f"Received training request: {data}")

    if (
        data.trainingMethod not in TRAINING_METHODS
        or data.baseModel not in BASE_MODELS
        or not data.datasetName
    ):
        return 400, {
            "status": "error",
            "message": "Invalid request parameters",
            "code": 400,
        }

    try:
        # 调度任务并立即响应
        worker = Worker()
        t = Task(
            method=data.trainingMethod,
            model=data.baseModel,
            dataset=data.datasetName,
        )
        worker.submit(t)

        return 200, {
            "status": "success",
            "message": f"Added task {t.id} to queue",
            "data": {"task_id": str(t.id)},
        }
    except Exception as e:
        api_logger.error(f"Error processing training request: {e}")
        return 500, {
            "status": "error",
            "message": f"An error occurred: {str(e)}",
            "code": 500,
        }
