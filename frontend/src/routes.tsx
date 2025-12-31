import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const SignIn = lazy(() => import("./features/auth/pages/sign-in"));
const MemberTable = lazy(() => import("./features/users/pages/member.table"));
const ManagerTable = lazy(() => import("./features/users/pages/manager.table"));
const Teams = lazy(() => import("./features/teams/pages/teams"));
const router = createBrowserRouter([
  {
    path: "/members",
    element: <MemberTable />,
  },
  {
    path: "/managers",
    element: <ManagerTable />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  }.
  {
    path: "/teams",
    element: <Teams />,
  },
]);

export default router;

