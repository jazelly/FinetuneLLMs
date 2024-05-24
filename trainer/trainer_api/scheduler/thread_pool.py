import random
import threading
import queue
import time
import multiprocessing
from multiprocessing import Process

class UserWork(threading.Event):
    def __init__(self, workId):
        super().__init__()
        self.workId = workId
        self.timer = None
        self.state = 'PENDDING'

    def setTimeout(self, timeout):
        self.timer = threading.Timer(timeout, self.cancel)
        self.timer.start()

    def clearTimeout(self):
        if self.timer:
            self.timer.cancel()
            self.timer = None

    def cancel(self):
        if self.state == 'END' or self.state == 'CANCELED':
            return False
        else:
            self.terminate()
            return True

    def setState(self, state):
        self.state = state

class Thread:
    def __init__(self, worker):
        self.worker = worker
        self.threadId = worker.ident
        self.state = 'IDLE'
        self.lastWorkTime = time.time()

    def setState(self, state):
        self.state = state

    def setLastWorkTime(self, time):
        self.lastWorkTime = time

    def ref(self):
        pass  # No equivalent in Python

    def unref(self):
        pass  # No equivalent in Python

class ThreadPool:
    def __init__(self, options=None):
        self.options = options if options else {}
        self.worker_queue = []
        self.coreThreads = multiprocessing.cpu_count()
        self.maxThreads = self.coreThreads
        self.discardPolicy = 'NOT_DISCARD'
        self.preCreate = True
        self.maxIdleTime = self.options.get('maxIdleTime', 60)
        self.workPool = {}
        self.workId = 0
        self.queue = []
        self.totalWork = 0
        self.maxWork = self.options.get('maxWork', float('inf'))
        self.timeout = self.options.get('timeout', None)
        self.pollIdle()

    def pollIdle(self):
        def check_idle():
            for thread in self.worker_queue:
                if thread.state == 'IDLE' and time.time() - thread.lastWorkTime > self.maxIdleTime:
                    thread.worker.terminate()

        timer = threading.Timer(1, check_idle)
        timer.daemon = True
        timer.start()

    def newThread(self):
        worker = Process(target=self.worker)
        worker.start()
        thread = Thread(worker)
        self.workerQueue.append(thread)
        return thread

    def selectThread(self):
        for thread in self.workerQueue:
            if thread.state == 'IDLE':
                return thread
        return self.workerQueue[int(random.random() * len(self.workerQueue))]

    def generateWorkId(self):
        self.workId += 1
        return self.workId

    def submit(self, filename, options=None):
        options = options if options else {}
        thread = None
        if self.workerQueue:
            thread = self.selectThread()
            if thread.state == 'BUSY':
                if len(self.workerQueue) < self.coreThreads:
                    thread = self.newThread()
                elif self.totalWork + 1 > self.maxWork:
                    if len(self.workerQueue) < self.maxThreads:
                        thread = self.newThread()
                    else:
                        pass  # Handle discard policy
        else:
            thread = self.newThread()

        workId = self.generateWorkId()
        userWork = UserWork(workId)
        if self.timeout:
            userWork.setTimeout(self.timeout)

        work = {'workId': workId, 'filename': filename, 'options': options}

        if thread.state == 'BUSY':
            self.queue.append(work)
            userWork.terminate = lambda: self.cancelWork(userWork)
        else:
            self.submitWorkToThread(thread, work)

        return userWork

    def submitWorkToThread(self, thread, work):
        userWork = self.workPool[work['workId']]
        userWork.setState('RUNNING')
        thread.setState('BUSY')
        thread.worker.send(work)

    def addWork(self, userWork):
        userWork.setState('PENDDING')
        self.workPool[userWork.workId] = userWork
        self.totalWork += 1

    def endWork(self, userWork):
        del self.workPool[userWork.workId]
        self.totalWork -= 1
        userWork.setState('END')
        userWork.clearTimeout()

    def cancelWork(self, userWork):
        del self.workPool[userWork.workId]
        self.totalWork -= 1
        userWork.setState('CANCELED')

    def traversal(self, fn):
        for worker in self.workerQueue:
            fn(worker)

    def ref(self):
        self.traversal(lambda worker: worker.ref())

    def unref(self):
        self.traversal(lambda worker: worker.unref())

    def stop(self):
        self.traversal(lambda worker: worker.terminate())

class CPUThreadPool(ThreadPool):
    def __init__(self, options=None):
        super().__init__({**options, 'coreThreads': multiprocessing.cpu_count(), 'expansion': False})

class SingleThreadPool(ThreadPool):
    def __init__(self, options=None):
        super().__init__({**options, 'coreThreads': 1, 'expansion': False})

class FixedThreadPool(ThreadPool):
    def __init__(self, options=None):
        super().__init__({**options, 'expansion': False})

defaultThreadPool = ThreadPool()
defaultCpuThreadPool = CPUThreadPool()
defaultFixedThreadPool = FixedThreadPool()
defaultSingleThreadPool = SingleThreadPool()
