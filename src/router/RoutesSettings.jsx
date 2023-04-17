import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ user, children, redirectTo = "/login" }) => {
  if (!user) return <Navigate to={redirectTo} />;
  return <Outlet />;
};

// export const PublicRoute = ({ user, children, redirectTo = "/" }) => {
//   if (user) return <Navigate to={redirectTo} />;
//   return <Outlet />;
// };
