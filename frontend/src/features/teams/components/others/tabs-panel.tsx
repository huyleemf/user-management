import {
  UserRoles,
  type UserByRole,
  type UserRole,
} from "@/features/users/api/types";
import { stringAvatar } from "@/shared/utils/utils";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import type { CreateTeamRequest } from "../../api/types";

interface TabPanelProps {
  users: UserByRole[];
  index: number;
  value: number;
  usersRole: UserRole;
  onUpdateFormData: (key: keyof CreateTeamRequest, value: any) => void;
  formData: CreateTeamRequest;
}
const TabsPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { users, value, index, onUpdateFormData, formData, ...other } = props;

  const handleUpdateFormData = useCallback(
    (key: keyof CreateTeamRequest, value: any) => {
      onUpdateFormData(key, value);
    },
    [onUpdateFormData]
  );
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {users.length === 0 ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{
            maxHeight: 300,
            paddingInline: 3,
          }}
        >
          <Typography>
            No {props.usersRole === UserRoles.MANAGER ? "managers" : "members"}{" "}
            found.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            paddingInline: 3,
          }}
        >
          <List>
            {users.map((user) => (
              <UserListItem
                onUpdateFormData={handleUpdateFormData}
                usersRole={props.usersRole}
                key={user.userId}
                user={user}
                formData={formData}
              />
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};

interface UserListItemProps {
  user: UserByRole;
  usersRole: UserRole;
  onUpdateFormData: (key: keyof CreateTeamRequest, value: any) => void;
  formData: CreateTeamRequest;
}

function UserListItem({
  user,
  usersRole,
  onUpdateFormData,
  formData,
}: UserListItemProps) {
  const isManager = usersRole === UserRoles.MANAGER;

  const isSelected = isManager
    ? formData.managers.some((m) => m.managerId === user.userId)
    : formData.members.some((m) => m.memberId === user.userId);
  const handleToggle = () => {
    if (isManager) {
      const newManagers = isSelected
        ? formData.managers.filter((m) => m.managerId !== user.userId)
        : [
            ...formData.managers,
            { managerId: user.userId, managerName: user.username },
          ];
      onUpdateFormData("managers", newManagers);
    } else {
      const newMembers = isSelected
        ? formData.members.filter((m) => m.memberId !== user.userId)
        : [
            ...formData.members,
            { memberId: user.userId, memberName: user.username },
          ];
      onUpdateFormData("members", newMembers);
    }
  };

  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <Avatar {...stringAvatar(user ? user.username : "John Doe")} />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography fontWeight={600}>{user.username}</Typography>
            {isManager && (
              <IconButton size="small" aria-label="manager role">
                <AssignmentIndIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        }
        secondary={
          <Typography fontSize={12} color="text.secondary">
            {user.email}
          </Typography>
        }
      />

      <IconButton
        aria-label={isSelected ? "remove user" : "add user"}
        onClick={handleToggle}
        sx={{
          bgcolor: isSelected ? "green" : "action.hover",
          color: isSelected ? "white" : "inherit",
          "&:hover": {
            bgcolor: isSelected ? "green" : "action.selected",
          },
        }}
      >
        {isSelected ? <CheckIcon /> : <AddIcon />}
      </IconButton>
    </ListItem>
  );
}

export default TabsPanel;
