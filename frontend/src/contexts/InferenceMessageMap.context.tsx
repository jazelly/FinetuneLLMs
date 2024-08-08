import type { Permalink, IPermalinksContext } from '@/types/common.type';
import { TRAINER_WS_URL_BASE } from '@/utils/constants';
import React, { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';

export type InferenceMessageList = InferenceMessage[];

export interface InferenceMessage {
  type: 'user' | 'assistant';
  message: string;
  code: number;
}

export interface InferenceMessageListContextData {
  messageList: InferenceMessageList;
  sendMessage: SendMessage | undefined;
  readyState: ReadyState;
}

export const InferenceMessageMapContext =
  createContext<InferenceMessageListContextData>({
    messageList: [],
    sendMessage: undefined,
    readyState: ReadyState.UNINSTANTIATED,
  });

export const InferenceMessageListProvider = ({ children }) => {
  const [messageList, setMessageList] = useState<InferenceMessageList>([]);

  const socketUrl = `${TRAINER_WS_URL_BASE}inference/`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    let dataJson: InferenceMessage | undefined;
    try {
      dataJson = JSON.parse(lastMessage?.data);
    } catch (err) {
      // noop
    }

    if (dataJson) {
      setMessageList((prev) => {
        return [...prev, dataJson];
      });
    }
  }, [lastMessage]);

  return (
    <InferenceMessageMapContext.Provider
      value={{ messageList, sendMessage, readyState }}
    >
      {children}
    </InferenceMessageMapContext.Provider>
  );
};
