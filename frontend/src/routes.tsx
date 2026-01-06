import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "./shared/layouts/dashboard";
import { RootErrorBoundary } from "./ErrorBoundary";

const SignIn = lazy(() => import("./pages/auth"));
const Dashboard = lazy(() => import("./pages/users/dashboard"));
const MemberTable = lazy(() => import("./pages/users/members"));
const ManagerTable = lazy(() => import("./pages/users/managers"));
const Teams = lazy(() => import("./pages/teams"));

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
