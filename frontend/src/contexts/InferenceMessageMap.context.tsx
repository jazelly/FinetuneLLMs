import type { Permalink, IPermalinksContext } from '@/types/common.type';
import { TRAINER_WS_URL_BASE } from '@/utils/constants';
import React, { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';

export type TrainerMessageMap = Record<string, InferenceMessage[]>;

export interface InferenceMessage {
  type: 'q' | 'a';
  message: string;
  code: number;
}

export interface TrainerMessageMapContextData {
  messageMap: TrainerMessageMap;
  sendMessage: SendMessage | undefined;
  readyState: ReadyState;
}

export const InferenceMessageMapContext =
  createContext<TrainerMessageMapContextData>({
    messageMap: {},
    sendMessage: undefined,
    readyState: ReadyState.UNINSTANTIATED,
  });

export const InferenceMessageMapProvider = ({ children }) => {
  const [socketUrl, setSocketUrl] = useState(`${TRAINER_WS_URL_BASE}inference`);
  const [messageMap, setMessageMap] = useState<TrainerMessageMap>({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    let dataJson;
    try {
      dataJson = JSON.parse(lastMessage?.data);
    } catch (err) {
      // noop
    }

    if (dataJson) {
      setMessageMap((prev) => {
        const newMessageMap = { ...prev };
        const oldList = newMessageMap[dataJson.data.task_id] ?? []; // TODO: key should be something more general
        newMessageMap[dataJson.data.task_id] = oldList.concat(dataJson);
        return newMessageMap;
      });
    }
  }, [lastMessage]);

  return (
    <InferenceMessageMapContext.Provider
      value={{ messageMap, sendMessage, readyState }}
    >
      {children}
    </InferenceMessageMapContext.Provider>
  );
};
