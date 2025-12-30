import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const MemberTable = lazy(() => import("./features/users/pages/MemberTable"));
const ManagerTable = lazy(() => import("./features/users/pages/ManagerTable"));
const router = createBrowserRouter([
  {
    path: "/members",
    element: <MemberTable />,
  },
  {
    path: "/managers",
    element: <ManagerTable />,
  },
]);

export default router;
