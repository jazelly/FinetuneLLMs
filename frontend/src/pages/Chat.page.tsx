import React, { useState } from 'react';
import ChatContainer from '@/components/Chat/ChatContainer.component';
import FullScreenLoader from '@/components/reusable/Loaders.component';
import InferencePanel from '@/components/InferencePanel.component';

export default function Chat() {
  const [modelId, setModelId] = useState<number | undefined>(undefined);

  return (
    <div className="h-full w-full">
      <InferencePanel model={modelId} />
    </div>
  );
}
