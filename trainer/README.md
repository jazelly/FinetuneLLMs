# Trainer in Django

Trainer is like a woker app that is intended to be only communicated with 
server side. Client should never try to communicate with trainer directly

## Design principle

Every task running in trainer is CPU/GPU intensive tasks, i.e. finetuning jobs. They should be rate-limited strictly

Trainer ideally, in the later stage, should be containerized and compatible with kubernetes deployments. Every training job should be scheduled in a queue until GPU is vacated.

In any case GPU/CPU job is finished, whether it's successfuly or failed due to out of memory, the job should end and log should be perserved in databse so that server can poll the result by id.

The polling should be requested through the socket established between server and trainer. The socket should be a long-live socket until any side is dead.



