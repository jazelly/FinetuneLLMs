import React from "react";
import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "./Preloader";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import useAuthenticated from "@/hooks/useAuthenticated";

// Allows only admin to access the route and if in single user mode,
// allows all users to access the route
export function AdminRoute({ Component }) {
  const { isAuthd, multiUserMode } = useAuthenticated();
  if (isAuthd === null) return <FullScreenLoader />;

  const user = userFromStorage();
  return isAuthd && (user?.role === "admin" || !multiUserMode) ? (
    <Component />
  ) : (
    <Navigate to={paths.home()} />
  );
}

export default function PrivateRoute({ Component, ...restProps }) {
  const { isAuthd } = useAuthenticated();
  if (isAuthd === null) return <FullScreenLoader />;

  return isAuthd ? (
    <Component {...restProps} />
  ) : (
    <Navigate to={paths.login(true)} />
  );
}
