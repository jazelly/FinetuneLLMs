import uuid

from trainer_api.consts import Methods, Models

class Task:
    def __init__(self, **kwargs):
        self.id = uuid.uuid4()
        if len(kwargs) > 0:
            for key, value in kwargs.items():
                # finetune method
                if key == "method":
                    if not isinstance(value, Methods):
                        raise TypeError("Must provide supported methods")
                    self.method = value
                # base model
                if key == "model":
                    if not isinstance(value, Models):
                        raise TypeError("Must provide supported models")
                    self.model = value

        else:
            raise TypeError("Task must be constructed from method and model")
        
    def __str__(self):
        return f"[Task] method: {self.method} training | model: {self.model}"