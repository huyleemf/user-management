import { authActions } from "@/features/auth/redux/slice";
import type { User } from "@/features/users/api/types";
import type { AppDispatch } from "@/redux/store";
import { storage } from "@/shared/utils/storage";
import { a11yProps, stringAvatar } from "@/shared/utils/utils";
import LogoutIcon from "@mui/icons-material/Logout";
import Person2Icon from "@mui/icons-material/Person2";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
const DashboardHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const user: User | null = storage.get("user");
  const [value, setValue] = useState<number>(() =>
    location === "/members"
      ? 0
      : location === "/managers"
      ? 1
      : location === "/teams"
      ? 2
      : 0
  );

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/sign-in");
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/members");
        break;
      case 1:
        navigate("/managers");
        break;
      case 2:
        navigate("/teams");
        break;
      default:
        break;
    }
  };

  return (
    <Box boxShadow={2}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          padding={2}
          component="h1"
          gutterBottom
        >
          User Management
        </Typography>
        <Stack direction={"row"} alignItems={"center"} gap={2} padding={2}>
          <Avatar {...stringAvatar(user?.username || "")} />
          <Box component={"div"} textAlign={"start"}>
            <Typography variant="body1">{user?.username}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
          <IconButton onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Box paddingInline={2}>
        <Tabs value={value} onChange={(_, newValue) => handleChange(newValue)}>
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Members</Typography>
                {/* <Chip
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
                /> */}
              </Stack>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <EngineeringIcon />
                <Typography>Managers</Typography>
                {/* <Chip
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
                /> */}
              </Stack>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <GroupsIcon />
                <Typography>Teams</Typography>
                {/* <Chip
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
                /> */}
              </Stack>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
