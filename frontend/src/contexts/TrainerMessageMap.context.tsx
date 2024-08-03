import type { Permalink, IPermalinksContext } from '@/types/common.type';
import { TRAINER_WS_URL_BASE } from '@/utils/constants';
import React, { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';

export interface TrainerMessage {
  type: 'title' | 'info' | 'warning';
  message: string;
  data: {
    task_id: string;
  };
  code: number;
}

export interface TrainerMessageMapContextData {
  messageHistory: TrainerMessage[];
  sendMessage: SendMessage | undefined;
  readyState: ReadyState;
}

export const TrainerMessageMapContext =
  createContext<TrainerMessageMapContextData>({
    messageHistory: [],
    sendMessage: undefined,
    readyState: ReadyState.UNINSTANTIATED,
  });

export const TrainerMessageMapProvider = ({ children }) => {
  const [socketUrl, setSocketUrl] = useState(
    `${TRAINER_WS_URL_BASE}training/job/`
  );
  const [messageHistory, setMessageHistory] = useState<TrainerMessage[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket<
    TrainerMessage | string
  >(socketUrl);

  useEffect(() => {
    let dataJson: TrainerMessage | undefined;
    try {
      dataJson = JSON.parse(lastMessage?.data);
    } catch (err) {
      return;
    }
    console.log('from trianer', dataJson);

    if (dataJson) {
      setMessageHistory((prev) => {
        const newMessageMap = prev.concat(dataJson);
        return newMessageMap;
      });
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <TrainerMessageMapContext.Provider
      value={{ messageHistory, sendMessage, readyState }}
    >
      {children}
    </TrainerMessageMapContext.Provider>
  );
};
