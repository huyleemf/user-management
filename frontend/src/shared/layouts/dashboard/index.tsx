import { useAuthorization } from "@/shared/utils/roles";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import DashboardHeader from "./components/dashboard-header";
const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthorization();
  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);
  return (
    <div>
      <DashboardHeader />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
