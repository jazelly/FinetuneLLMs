import React from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <UserMenu>
      <div className="h-screen overflow-hidden bg-main flex">
        <DefaultChatContainer />
      </div>
    </UserMenu>
  );
}
