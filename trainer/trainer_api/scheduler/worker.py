
from collections import defaultdict
from datetime import datetime
import os
import threading
import subprocess
from typing import Dict


from trainer_router.settings import BASE_DIR
from trainer_api.consts import MAX_IDLE_TIME, Methods, Models, WorkerStates
from trainer_api.scheduler.task import Task
from .queue import MQueue
from queue import Queue

class Singleton:
    """
    A non-thread-safe helper class to ease implementing singletons.
    This should be used as a decorator -- not a metaclass -- to the
    class that should be a singleton.

    The decorated class can define one `__init__` function that
    takes only the `self` argument. Also, the decorated class cannot be
    inherited from. Other than that, there are no restrictions that apply
    to the decorated class.

    To get the singleton instance, use the `instance` method. Trying
    to use `__call__` will result in a `TypeError` being raised.

    """

    def __init__(self, decorated):
        self._decorated = decorated

    def instance(self):
        """
        Returns the singleton instance. Upon its first call, it creates a
        new instance of the decorated class and calls its `__init__` method.
        On all subsequent calls, the already created instance is returned.

        """
        try:
            return self._instance
        except AttributeError:
            self._instance = self._decorated()
            return self._instance

    def __call__(self):
        raise TypeError('Singletons must be accessed through `instance()`.')

    def __instancecheck__(self, inst):
        return isinstance(inst, self._decorated)

def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

def default_worker_status():
    return {
        "state": WorkerStates.IDLE,
        "last_work_time": datetime.now(),
    }

@singleton
class Worker():
    """
    Worker - Singleton Class of the Worker Manager
    """
    def __init__(self, *args, **kwargs):
        self.task_queue = MQueue[Task]()
        self.task_queue_lock = threading.Lock()
        

        self.max_idle_time = ~~kwargs["max_idle_time"] if "max_idle_time" in kwargs else MAX_IDLE_TIME
        self.max_thread = ~~kwargs["max_thread"] if "max_thread" in kwargs else 1

        self.n_thread = 0
        self.thread_map: Dict[int, WorkerThread] = {}

    def remove_worker(self, id: int):
        # check how the job is done
        if self.thread_map.id["state"] != WorkerStates.DONE:  
          #TODO: possibly retry?
          pass
        finished_thread = self.thread_map.pop(id)
        finished_thread.join()


    def add_task(self, **kwargs):
        """
        Add a task to the queue anyway, unless the task is invalid
        Then check if there are worker threads number exceeding max number
        if not, spawn a thread to take the task
        if yes, just return
        """
        try:
            new_task = Task(**kwargs)
            self.task_queue.add(new_task)
        except TypeError as e:
            print(str(e))
            print(f"Cannot create task {', '.join(f'{key}={value}' for key, value in kwargs.items())}")
            return 0
        
        if self.n_thread + 1 > self.max_thread:
            return -1
        
        new_thread = WorkerThread(self)
        new_thread.start()

        self.thread_map[new_thread.ident] = new_thread
        self.n_thread += 1
        return 1

    def pop_task(self) -> Task:
        return self.task_queue.pop()



class WorkerThread(threading.Thread):
    def __init__(self, worker_instance: Worker):
        super().__init__()
        self.worker_instance = worker_instance
        self.id = threading.get_ident()
        self.state = WorkerStates.IDLE
    
    def run(self):
        print("[Worker] A worker thread started")
        if self.worker_instance.task_queue.length == 0:
            print("[Worker] Nothing in queue, passing")
            return


        # prepare the log file
        log_filename = datetime.now().strftime("%Y%m%d_%H%M%S_worker.txt")
        log_dir_path = "trainer_api/logs/"
        log_path = os.path.join(BASE_DIR, log_dir_path, log_filename)
        os.makedirs(log_dir_path, exist_ok=True)
        print(log_path)
        with open(log_path, 'w') as log:
            try:
                task = self.worker_instance.pop_task()
                if task is None:
                    print(f"[Worker] Worker thread is finished with state {self.state}.")
                    log.write(f"[Worker] Worker thread is finished with state {self.state}.\n")
                    self.worker_instance.remove_worker(self.id)
                    return
                
                # notify worker manager: started working on a task
                self.task_id = task.id
                print(f"[Worker] Picked a task: \n{task}")
                # process task
                if task.method == Methods.SFT and task.model == Models.LLAMA2:
                    self.state = WorkerStates.BUSY
                    
                    subprocess.run(["python3", "../finetune/sft.py"], stdout=log, stderr=log, check=True)
                
                self.state = WorkerStates.DONE
                print(f"[Worker] Task completed: {task}")
                log.write(f"[Worker] Task completed: {task}.\n")
            except subprocess.CalledProcessError as e:
                self.state = WorkerStates.ERROR
                print(f"[Worker] Task failed: {task}, Error: {str(e)}")
                log.write(f"[Worker] Task failed: {task}, Error: {str(e)}.\n")

        print(f"[Worker] Worker thread is finished with state {self.state}")
        self.worker_instance.remove_worker(self.id)
        return
