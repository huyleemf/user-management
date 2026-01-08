import type { User } from "@/data/users/types";
import { authActions } from "@/redux/auth/slice";
import type { AppDispatch } from "@/redux/store";
import { storage } from "@/shared/utils/storage";
import { a11yProps, stringAvatar } from "@/shared/utils/utils";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
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
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router";

const urls = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    value: 0,
  },
  {
    label: "Members",
    icon: <Person2Icon />,
    value: 1,
  },
  {
    label: "Managers",
    icon: <EngineeringIcon />,
    value: 2,
  },
  {
    label: "Teams",
    icon: <GroupsIcon />,
    value: 3,
  },
];

const DashboardHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const user: User | null = storage.get("user");

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/sign-in");
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
        <Tabs
          value={
            urls.find((url) => location.includes(url.label.toLowerCase()))
              ?.value || 0
          }
        >
          {urls.map((url) => (
            <NavTab
              key={url.value}
              label={url.label}
              value={url.value}
              icon={url.icon}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

const NavTab = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <NavLink to={label.toLowerCase()} style={{ textDecoration: "none" }}>
      <Tab
        label={
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            {icon}
            <Typography>{label}</Typography>
          </Stack>
        }
        {...a11yProps(value)}
      />
    </NavLink>
  );
};

export default DashboardHeader;
