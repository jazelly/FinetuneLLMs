import React, { useEffect, useState } from 'react';
import ChatContainer from './Chat/ChatContainer.component';
import LoadingChat from './Chat/LoadingChat.component';

export interface InferencePanelProps {
  model?: string;
}

const InferencePanel = ({ model }: InferencePanelProps) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [modelDetail, setModelDetail] = useState<
    | { name: string; id: string; base: string; trainedBy: number | undefined }
    | undefined
  >(undefined);

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
      <ChatContainer />
    </div>
  );
};

export default InferencePanel;
