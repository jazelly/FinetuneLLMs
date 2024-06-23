import { CaretUp } from '@phosphor-icons/react';
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex items-center p-4 shadow-md w-full bg-main-base">
      <textarea
        data-key="chat-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Send a message"
        className="flex-grow h-[48px] resize-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
      />
      <div
        data-key="chat-send-button"
        className="absolute right-6 flex h-[32px] px-4 justify-center items-center cursor-pointer rounded-lg bg-main-blue hover:bg-blue-600 focus:outline-none"
        onClick={handleSendClick}
      >
        <span className="text-white">Send</span>
        <div className="ml-2">
          <CaretUp size={24} weight="bold" color="white" />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
