import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

export const AppLayout = ({ user = {} }) => {
  return (
    <Sidebar user={user}>
      <Outlet />
    </Sidebar>
  );
};

export default AppLayout;
