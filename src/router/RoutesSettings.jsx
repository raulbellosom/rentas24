import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ user, redirectTo = "/login" }) => {
  if (!user) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};

export const PublicOnlyRoute = ({ user, redirectTo = "/owner/properties" }) => {
  if (user) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};
