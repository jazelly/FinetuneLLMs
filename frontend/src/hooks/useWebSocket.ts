import {
  useEffect,
  useRef,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

import { TRAINER_WS_URL_BASE } from '@/utils/constants';
import { flushSync } from 'react-dom';

export type SendMessage<T extends string> = (
  message: T,
  keep?: boolean
) => void;

export type SendMessageJSON<T extends Record<string, any>> = (
  message: T,
  keep?: boolean
) => void;
export type WebSocketHook<
  RequestProtocol extends Record<string, any>,
  ReponseProtocol extends Record<string, any>,
  P = WebSocketEventMap['message'] | null,
> = {
  sendMessage: SendMessage<string>;
  sendMessageJSON: SendMessageJSON<RequestProtocol>;
  messageMap: Record<string, Array<ReponseProtocol>>;
  getWebSocket: () => WebSocket | null;
};

function assertIsWebSocket(
  webSocketInstance: WebSocket
): asserts webSocketInstance is WebSocket {
  if (webSocketInstance instanceof WebSocket === false) throw new Error('');
}

const bindMessageHandler = <
  Request extends Record<string, any>,
  Response extends Record<string, any>,
>(
  webSocketInstance: WebSocket,
  messageMap: Record<string, Array<Request>>,
  setMessageMap: Dispatch<SetStateAction<Response>>
) => {
  let heartbeatCb: () => void;

  webSocketInstance.onmessage = (event: WebSocketEventMap['message']) => {
    heartbeatCb?.();
    let resp: Response;
    try {
      resp = JSON.parse(event.data);
    } catch (err: any) {
      console.error('received non-json data');
      return;
    }
    console.log('Received message data: ', resp);

    if (resp.data?.task_id) {
      const tid = resp.data.task_id;
      const messageList = tid in messageMap ? messageMap[tid] : [];
      const updatedMessageList = { [tid]: [...messageList, resp.data] };

      flushSync(() =>
        setMessageMap((prevMessages) => {
          return {
            ...prevMessages,
            ...updatedMessageList,
          };
        })
      );
    }
  };
};

const useWebSocket = <
  Request extends Record<string, any>,
  Response extends Record<string, any>,
>(): WebSocketHook<Request, Response> => {
  const [messageMap, setMessageMap] = useState<Record<string, Response[]>>({});
  const messageQueue = useRef<Array<string>>([]);

  const webSocketRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((msg: string, keep = true) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN && msg) {
      assertIsWebSocket(webSocketRef.current);
      webSocketRef.current.send(msg);
    } else {
      console.log(
        'Socket already closed from trainer side! State Code: ',
        webSocketRef.current?.readyState
      );
      if (keep) messageQueue.current.push(msg);
    }
  }, []);

  const sendMessageJSON = useCallback((msg: Request, keep = true) => {
    const msgString = JSON.stringify(msg);
    if (webSocketRef.current?.readyState === WebSocket.OPEN && msg) {
      assertIsWebSocket(webSocketRef.current);
      webSocketRef.current.send(msgString);
    } else {
      console.log(
        'Socket already closed from trainer side! State Code: ',
        webSocketRef.current?.readyState
      );
      if (keep) messageQueue.current.push(msgString);
    }
  }, []);

  const getWebSocket = useCallback(() => {
    if (webSocketRef.current) {
      assertIsWebSocket(webSocketRef.current);
    }
    return webSocketRef.current;
  }, []);

  useEffect(() => {
    if (webSocketRef.current) return;

    console.log('connecting to WS');
    console.log(typeof webSocketRef.current);

    const start = async () => {
      // TODO: abstact out url
      webSocketRef.current = new WebSocket(
        `${TRAINER_WS_URL_BASE}training/job/`
      );
      const protectedSetMessageMap = () => {};

      // attach listeners
      webSocketRef.current.onopen = () => {
        // only ref the opened socket
        console.log('WebSocket connection established');
      };

      bindMessageHandler(webSocketRef.current, messageMap, setMessageMap);

      webSocketRef.current.onerror = (event) => {
        if (event.type !== 'error') {
          console.error('Got error event but type is not error');
          return;
        }
      };

      webSocketRef.current.onclose = (event) => {
        // server side closed
        if (event.code === 1006) {
          console.log('WebSocket closed as server side has closed');
        } else {
          console.log('WebSocket connection closed');
        }
      };
    };

    start();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close(1000, 'Client closing connection');
        webSocketRef.current = null;
      }
    };
  }, []);

  return {
    getWebSocket,
    messageMap,
    sendMessage,
    sendMessageJSON,
  };
};

export default useWebSocket;
