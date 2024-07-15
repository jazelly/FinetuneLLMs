import React, { useEffect, useState } from 'react';
import ChatBubble from './ChatBubble.component';
import { IChatMessage } from '@/types/common.type';
import { DEFAULT_CHAT_MESSAGES } from '@/utils/constants';
import Scrollable from '../reusable/Scrollable.component';
import PromptInput from './PromptInput.component';

export default function ChatContainer({
  chatMessages,
  chatDisabled,
}: {
  chatMessages: IChatMessage[];
  chatDisabled?: boolean;
}) {
  const [messages, setMessages] = useState<IChatMessage[]>(chatMessages);
  const [loadingResponse, setLoadingResponse] = useState(false);

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

      {!chatDisabled && (
        <PromptInput
          submit={handleSendMessage}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
        />
      )}
    </div>
  );
}
