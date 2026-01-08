import type { CreateTeamRequest } from "@/data/teams/types";
import { UserRoles, type UserByRole, type UserRole } from "@/data/users/types";
import { stringAvatar } from "@/shared/utils/utils";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CheckIcon from "@mui/icons-material/Check";
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
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface TabPanelProps {
  users: UserByRole[];
  index: number;
  value: number;
  usersRole: UserRole;
}
const TabsPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { users, value, index, ...other } = props;

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
                usersRole={props.usersRole}
                key={user.userId}
                user={user}
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
}

function UserListItem({ user, usersRole }: UserListItemProps) {
  const isManager = usersRole === UserRoles.MANAGER;
  const fieldName = isManager ? "managers" : "members";
  const { control } = useFormContext<CreateTeamRequest>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });
  const index = fields.findIndex((item: any) =>
    isManager ? item.managerId === user.userId : item.memberId === user.userId
  );

  const isSelected = index !== -1;

  const handleToggle = () => {
    if (isSelected) {
      remove(index);
    } else {
      append(
        isManager
          ? {
              managerId: user.userId,
              managerName: user.username,
            }
          : {
              memberId: user.userId,
              memberName: user.username,
            }
      );
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
