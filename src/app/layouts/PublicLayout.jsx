import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

export const PublicLayout = () => {
  return (
    <Sidebar user={{}}>
      <Outlet />
    </Sidebar>
  );
};

export default PublicLayout;
