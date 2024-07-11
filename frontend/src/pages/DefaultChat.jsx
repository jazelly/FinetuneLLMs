import React from 'react';
import ChatContainer from '@/components/Chat/ChatContainer.component';
import FullScreenLoader from '@/components/reusable/Loaders.component';

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-main-base flex">
      <ChatContainer />
    </div>
  );
}
