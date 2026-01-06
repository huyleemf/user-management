import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { UserRoles } from "../../../data/users/types";
import { Box, CircularProgress, Stack } from "@mui/material";
import { userActions } from "../../../redux/user/slice";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/table";

const MemberTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(userActions.fetchUsersRequested(UserRoles.MEMBER));
  }, [dispatch]);

  if (loading || error)
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: "100vh",
        }}
      >
        {loading ? (
          <Stack direction="row" alignItems="center" gap={2}>
            <CircularProgress /> Loading users...
          </Stack>
        ) : (
          `Error: ${error}`
        )}
      </Box>
    );

  return <DataTable columns={columns} data={users} />;
};

export default MemberTable;
