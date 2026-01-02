import React from "react";
import type { GetTeamsResponse } from "../api/types";
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { stringAvatar } from "@/features/users/utils/utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
interface TeamCardProps {
  card: GetTeamsResponse;
}
const TeamCard: React.FC<TeamCardProps> = ({ card }) => {
  return (
    <Card>
      <CardHeader
        sx={{
          paddingBlockEnd: 0,
        }}
        action={
          <Stack direction="row" spacing={1}>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
        title={<Typography variant="h6">{card.teamName}</Typography>}
        subheader={`Team Leader: ${card.teamLeader.username}`}
      />
      <CardContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1} alignItems={"start"}>
          <Typography variant="body1" color="textDisabled">
            {card.members.length} Users:
          </Typography>
          <AvatarGroup total={card.members.length}>
            {card.members.map((member) => (
              <Avatar
                key={member.memberId}
                {...stringAvatar(member.memberName)}
              />
            ))}
          </AvatarGroup>
        </Stack>
        <Stack spacing={1} alignItems={"start"}>
          <Typography color="textDisabled" variant="body1">
            {card.managers.length} Managers:
          </Typography>
          <AvatarGroup total={card.managers.length}>
            {card.managers.map((manager) => (
              <Avatar
                key={manager.managerId}
                {...stringAvatar(manager.managerName)}
              />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
