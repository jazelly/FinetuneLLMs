import React from 'react';
import ChatContainer from '@/components/ChatContainer.component';
import PasswordModal, { usePasswordModal } from '@/components/Modals/Password';
import FullScreenLoader from '@/components/Loaders.component';

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-main flex">
      <ChatContainer />
    </div>
  );
}
