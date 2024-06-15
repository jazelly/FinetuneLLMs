import { useEffect, useRef, useState, useCallback } from 'react';

import { TRAINER_WS_URL_BASE } from '@/utils/constants';

export interface TrainerResponseWS {
  type: string;
  status: 'success' | 'failed' | 'error';
  message: string;
  code: number;
  data?: Record<string, any>;
}

const useWebSocket = () => {
  const [messages, setMessages] = useState<
    Record<string, Array<TrainerResponseWS>>
  >({});
  const messageQueue = useRef<Array<string>>([]);

  const trainerSocketRef = useRef<WebSocket | null>(null);

  const sendMessageToTrainer = useCallback(
    (msg: string) => {
      if (
        trainerSocketRef.current &&
        trainerSocketRef.current.readyState === WebSocket.OPEN &&
        msg
      ) {
        trainerSocketRef.current.send(msg);
      } else {
        messageQueue.current.push(msg);
      }
    },
    [trainerSocketRef.current]
  );

  useEffect(() => {
    const ws = new WebSocket(`${TRAINER_WS_URL_BASE}training/job/`);
    trainerSocketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    // every message is pushed to history
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message data: ', data);

      if (data.task_id) {
        const messageList =
          data.task_id in messages ? messages[data.task_id] : [];
        setMessages({
          ...messages,
          ...{ [data.task_id]: [...messageList, data] },
        });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    trainerSocketRef.current = ws;

    return () => {
      if (trainerSocketRef.current) {
        trainerSocketRef.current.close(1000, 'Client closing connection');
        trainerSocketRef.current = null;
      }
    };
  }, []);

  return {
    trainerSocket: trainerSocketRef,
    messages,
    sendMessageToTrainer,
  };
};

export default useWebSocket;
