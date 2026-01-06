import React from "react";
import DashboardHeader from "./components/dashboard-header";
import { Outlet } from "react-router";
const DashboardLayout: React.FC = () => {
  return (
    <div>
      <DashboardHeader />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
