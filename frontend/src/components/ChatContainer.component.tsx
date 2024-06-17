import React, { useEffect, useState } from 'react';
import ChatBubble from '@/components/ChatBubble.component';
import useUser from '@/hooks/useUser';
import UploadDatasets, {
  useUploadDatasetsModal,
} from './Modals/UploadDatasets';
import { IChatMessage } from '@/types/common.type';

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

  const MESSAGES: IChatMessage[] = [
    {
      message:
        'Welcome to FinetuneLLMs, FinetuneLLMs is an open-source AI tool that simplify your AI training requirements. All you need is an Nvidia GPU on your server.',
      type: 'AI',
      id: 'system',
    },
    {
      message: 'How do I get started?!',
      type: 'USER',
      id: 'anon',
    },
    {
      message:
        "It's simple. You just need to choose model, method and dataset. You can upload a dataset or use the existing HuggingFace ones. Once all set, you can start training your AI by submitting a job.",
      type: 'AI',
      id: 'system',
    },
    {
      message: 'Start creating your first finetuning job',
      type: 'AI',
      id: 'system',
    },
  ];

  useEffect(() => {
    function processMsgs() {
      if (!!window.localStorage.getItem('finetunellms_intro')) {
        setMessages([...MESSAGES]);
        return false;
      } else {
        setMessages([MESSAGES[0]]);
      }

      window.localStorage.setItem('finetunellms_intro', '1');
    }

    processMsgs();
  }, []);

  return (
    <div
      style={{ height: 'calc(100% - 32px)' }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
    >
      {messages.map((content, i) => (
        <ChatBubble
          message={content.message}
          type={content.type}
          id={content.id}
        />
      ))}
    </div>
  );
}
