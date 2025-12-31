import { a11yProps } from "@/features/users/utils/utils";
import type { AppDispatch, RootState } from "@/redux/store";
import Person2Icon from "@mui/icons-material/Person2";
import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { userActions } from "@/features/users/redux/slice";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<number>(0);

  const { managers, members, loading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(userActions.fetchManagersRequested());
    dispatch(userActions.fetchMembersRequested());
  }, [dispatch]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    navigate(newValue === 0 ? "/members" : "/managers");
  };

  return (
    <Box boxShadow={2}>
      <Typography
        variant="h4"
        fontWeight={600}
        padding={2}
        component="h1"
        gutterBottom
      >
        User Management
      </Typography>
      <Box paddingInline={2}>
        <Tabs value={value} onChange={(_, newValue) => handleChange(newValue)}>
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Members</Typography>
                <Chip
                  label={loading ? "..." : members.length}
                  sx={{
                    height: "fit-content",
                  }}
                  slotProps={{
                    label: {
                      style: {
                        padding: "0 6px",
                      },
                    },
                  }}
                />
              </Stack>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Managers</Typography>
                <Chip
                  label={loading ? "..." : managers.length}
                  sx={{
                    height: "fit-content",
                  }}
                  slotProps={{
                    label: {
                      style: {
                        padding: "0 6px",
                      },
                    },
                  }}
                />
              </Stack>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
