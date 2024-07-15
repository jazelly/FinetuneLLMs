FROM nvidia/cuda:12.5.0-runtime-ubuntu22.04
RUN apt update
RUN apt install python3.11 -y && \
    apt install python3-pip -y
WORKDIR /trainer
COPY requirements.txt ./
COPY . .
RUN pip3 install -r requirements.txt
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "trainer.asgi:trainer_api"]
