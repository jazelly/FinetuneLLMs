import React, { useEffect, useState } from 'react';
import ChatBubble from '@/components/ChatBubble.component';
import useUser from '@/hooks/useUser';
import { IChatMessage } from '@/types/common.type';
import { DEFAULT_CHAT_MESSAGES } from '@/utils/constants';
import ChatInput from '@/components/ChatInput.component';
import Scrollable from './reusable/Scrollable.component';

export default function ChatContainer() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const { user } = useUser();

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
      <Scrollable>
        <div className="flex-1">
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

      <div data-key="chat-input-container" className="h-20">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
