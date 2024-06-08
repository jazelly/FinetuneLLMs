from . import task

print("task imported")

t = task.Task(method="sft", model="LLAMA 2")
t.run()
