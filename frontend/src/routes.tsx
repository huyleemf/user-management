import { createBrowserRouter } from "react-router";
import UsersTable from "./features/users/pages/Table";
const router = createBrowserRouter([
  {
    path: "/",
    element: <UsersTable />,
  },
]);

export default router;
