import React, { useEffect, useState } from 'react';
import ChatContainer from './Chat/ChatContainer.component';
import LoadingChat from './Chat/LoadingChat.component';

export interface InferencePanelProps {
  model?: number;
}

const InferencePanel = ({ model }: InferencePanelProps) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [modelDetail, setModelDetail] = useState<
    | { name: string; id: number; base: string; trainedBy: number | undefined }
    | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      //   const fetchedMessages = await Chat.getMessageHistory();
      //   setMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setModelLoading(true);
    if (!model) return;
    const fetchModel = async () => {};

    fetchModel();

    setModelLoading(false);
  }, [model]);

  if (modelLoading) return <LoadingChat />;
  if (!model)
    return (
      <div className="flex items-center justify-center h-full">
        <span>Select a model and start chatting</span>
      </div>
    );

  return (
    <div className={`h-full`}>
      <ChatContainer chatMessages={[]} />
    </div>
  );
};

export default InferencePanel;
