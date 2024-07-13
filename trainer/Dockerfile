FROM python:3.11
WORKDIR /trainer
COPY requirements.txt ./
COPY entrypoint.sh ./
COPY . .


RUN pip install -r requirements.txt
CMD ["python", "watch.py"]
