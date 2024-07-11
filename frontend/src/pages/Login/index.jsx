import React from 'react';
import FullScreenLoader from '@/components/reusable/Loaders.component';
import { Navigate } from 'react-router-dom';
import paths from '@/utils/paths';

export default function Login() {
  const { loading, requiresAuth, mode } = usePasswordModal(!!query.get('nt'));
  if (loading) return <FullScreenLoader />;
  if (requiresAuth === false) return <Navigate to={paths.home} />;

  return <div>Login</div>;
}
