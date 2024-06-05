import json
from channels.generic.websocket import AsyncWebsocketConsumer


class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connected with react client")
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        print(f"received {text_data}")

        await self.send(text_data=json.dumps({"message": text_data}))

    async def send_message(self, message):
        # Send a message to the WebSocket client
        await self.send(text_data=json.dumps({"message": message}))
