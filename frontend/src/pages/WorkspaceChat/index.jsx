import React, { useEffect, useState } from 'react';
import { default as WorkspaceChatContainer } from '@/components/WorkspaceChat';
import { useParams } from 'react-router-dom';
import Workspace from '@/models/workspace';
import FullScreenLoader from '@/components/reusable/Loaders.component';

export default function WorkspaceChat() {
  const { loading } = usePasswordModal();

  if (loading) return <FullScreenLoader />;

  return <ShowWorkspaceChat />;
}

function ShowWorkspaceChat() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    getWorkspace();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-main-base flex">
      <WorkspaceChatContainer loading={loading} workspace={workspace} />
    </div>
  );
}
