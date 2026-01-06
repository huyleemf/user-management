import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "./shared/layouts/dashboard";
import { RootErrorBoundary } from "./ErrorBoundary";

const SignIn = lazy(() => import("./features/auth/pages/sign-in"));
const Dashboard = lazy(() => import("./features/users/pages/dashboard"));
const MemberTable = lazy(() => import("./features/users/pages/member.table"));
const ManagerTable = lazy(() => import("./features/users/pages/manager.table"));
const Teams = lazy(() => import("./features/teams/pages/teams"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RootErrorBoundary />,
    Component: DashboardLayout,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "members", element: <MemberTable /> },
      { path: "managers", element: <ManagerTable /> },
      { path: "teams", element: <Teams /> },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);

export default router;
