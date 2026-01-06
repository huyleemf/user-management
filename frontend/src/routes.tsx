import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "./shared/layouts/dashboard";

const SignIn = lazy(() => import("./features/auth/pages/sign-in"));
const MemberTable = lazy(() => import("./features/users/pages/member.table"));
const ManagerTable = lazy(() => import("./features/users/pages/manager.table"));
const Teams = lazy(() => import("./features/teams/pages/teams"));
const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [{ path: "/members", element: <MemberTable /> }],
  },
  {
    Component: DashboardLayout,
    children: [{ path: "/managers", element: <ManagerTable /> }],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    Component: DashboardLayout,
    children: [{ path: "/teams", element: <Teams /> }],
  },
]);

export default router;
