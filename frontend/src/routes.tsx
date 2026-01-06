import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const SignIn = lazy(() => import("./pages/auth"));
const MemberTable = lazy(() => import("./pages/users/members"));
const ManagerTable = lazy(() => import("./pages/users/managers"));
const Teams = lazy(() => import("./pages/teams"));
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
  },
  {
    path: "/teams",
    element: <Teams />,
  },
]);

export default router;
