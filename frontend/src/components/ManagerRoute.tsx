// Allows manager and admin to access the route and if in single user mode,

import React from "react";
import useAuthenticated from "@/hooks/useAuthenticated";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "./Preloader";

// allows all users to access the route
export function ManagerRoute({ Component }) {
  const { isAuthd, multiUserMode } = useAuthenticated();
  if (isAuthd === null) return <FullScreenLoader />;

  const user = userFromStorage();
  return isAuthd && (user?.role !== "default" || !multiUserMode) ? (
    <Component />
  ) : (
    <Navigate to={paths.home()} />
  );
}
