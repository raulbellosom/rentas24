import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="r24-min-h-dvh bg-brand-950">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
