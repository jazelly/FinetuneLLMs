import React, { useEffect, useState } from 'react';
import ChatBubble from './ChatBubble.component';
import { IChatMessage } from '@/types/common.type';
import { DEFAULT_CHAT_MESSAGES } from '@/utils/constants';
import Scrollable from '../reusable/Scrollable.component';
import PromptInput from './PromptInput.component';

export default function ChatContainer() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    // TODO: chat histories?
    const fetchData = async () => {
      //   const fetchedMessages = await Chat.getMessageHistory();
      //   setMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  useEffect(() => {
    function processMsgs() {
      setMessages([...DEFAULT_CHAT_MESSAGES]);
      return false;
    }

    processMsgs();
  }, []);

  const handleSendMessage = (message: string) => {
    const newMessage: IChatMessage = {
      id: 'anon',
      role: 'user',
      message: message,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <Scrollable color="white">
        <div className="flex-1 overflow-x-hidden">
          {messages.map((content, index) => (
            <ChatBubble
              key={index}
              message={content.message}
              role={content.role}
              id={content.id}
            />
          ))}
        </div>
      </Scrollable>

      <PromptInput
        submit={handleSendMessage}
        inputDisabled={loadingResponse}
        buttonDisabled={loadingResponse}
      />
    </div>
  );
}
