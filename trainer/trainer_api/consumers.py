from channels.generic.websocket import WebsocketConsumer
import json


class TrainerConsumer(WebsocketConsumer):
    clients = {}

    def connect(self):
        self.accept()
        # Store the client identifier (e.g., user ID) associated with the WebSocket connection
        self.identifier = self.scope[
            "user"
        ].id  # Example: using user ID as the identifier
        self.clients[self.identifier] = self

    def disconnect(self, close_code):
        # Remove the client from the mapping when it disconnects
        del self.clients[self.identifier]

    def send_message_to_client(self, event):
        # Send message to a specific client
        client_id = event["client_id"]
        message = event["message"]
        self.clients[client_id].send(text_data=json.dumps(message))
