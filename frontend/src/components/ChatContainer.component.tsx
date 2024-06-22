import React, { useEffect, useState } from 'react';
import ChatBubble from '@/components/ChatBubble.component';
import useUser from '@/hooks/useUser';
import { IChatMessage } from '@/types/common.type';
import { DEFAULT_CHAT_MESSAGES } from '@/utils/constants';
import ChatInput from '@/components/ChatInput.component';

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
      setMessages([
        ...DEFAULT_CHAT_MESSAGES,
        ...DEFAULT_CHAT_MESSAGES,
        ...DEFAULT_CHAT_MESSAGES,
      ]);
      return false;
    }

    processMsgs();
  }, []);

  const handleSendMessage = (message: string) => {
    const newMessage: IChatMessage = {
      id: Date.now().toString(),
      role: user ? 'ai' : 'user',
      message: message,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll relative">
      <div className="p-4">
        {messages.map((content, i) => (
          <ChatBubble
            key={content.id}
            message={content.message}
            role={content.role}
            id={content.id}
          />
        ))}
      </div>
      <div className="absolute bottom-0">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
