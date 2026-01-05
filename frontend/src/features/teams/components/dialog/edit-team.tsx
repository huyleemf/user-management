import { stringAvatar } from "@/shared/utils/utils";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import type { GetTeamsResponse } from "../../api/types";
import { useGetTeamByIdQuery } from "../../queries/query";
import AddUserDialog from "./add-user";
import DeleteUserDialog from "./del-user";
import { useAuthorization } from "@/shared/utils/roles";

const EditTeamDialog: React.FC<{ teamId: string }> = ({ teamId }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: team,
    error,
    isLoading,
  } = useGetTeamByIdQuery(teamId, { enabled: open });

  return (
    <>
      <Tooltip title="Edit Team">
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Team
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {isLoading && (
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="center"
              height={200}
            >
              <CircularProgress />
              <Typography>Loading details...</Typography>
            </Stack>
          )}

          {error && (
            <Typography color="error" align="center" mt={4}>
              Failed to load team data.
            </Typography>
          )}

          {team && !isLoading && <TeamDetailContent team={team} />}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="inherit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditTeamDialog;

const TeamDetailContent: React.FC<{ team: GetTeamsResponse }> = ({ team }) => {
  return (
    <Stack spacing={4} mt={2}>
      <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700} color="primary">
            {team.teamName}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              {...stringAvatar(team.teamLeader?.username || "U")}
              sx={{ width: 56, height: 56, bgcolor: "secondary.main" }}
            />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Team Leader
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {team.teamLeader?.username || "N/A"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Tables Section: Responsive Grid */}
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <UserListTable
            title="Managers"
            roleLabel="Manager"
            users={team.managers}
            idKey="managerId"
            nameKey="managerName"
            team={team}
            userType="manager"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <UserListTable
            title="Members"
            roleLabel="Member"
            users={team.members}
            idKey="memberId"
            nameKey="memberName"
            userType="member"
            team={team}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

interface UserListTableProps {
  title: string;
  roleLabel: string;
  users: any[] | undefined;
  idKey: string;
  nameKey: string;
  userType: "manager" | "member";
  team: GetTeamsResponse;
}

const UserListTable: React.FC<UserListTableProps> = ({
  title,
  roleLabel,
  users,
  idKey,
  nameKey,
  userType,
  team,
}) => {
  const { canAddMember, canAddManager, canRemoveManager, canRemoveMember } =
    useAuthorization();

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}{" "}
          <Chip size="small" label={users?.length || 0} sx={{ ml: 1 }} />
        </Typography>

        {(userType === "member" ? canAddMember(team) : canAddManager(team)) && (
          <AddUserDialog team={team} type={userType} />
        )}
      </Stack>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: 300 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user[idKey]} hover>
                  <TableCell>
                    <Chip
                      label={roleLabel}
                      size="small"
                      color={userType === "manager" ? "warning" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user[nameKey]}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {(userType === "member"
                      ? canRemoveMember(team)
                      : canRemoveManager(team, user[idKey])) && (
                      <DeleteUserDialog
                        role={userType}
                        teamId={team.teamId}
                        userId={user[idKey]}
                        username={user[nameKey]}
                        teamName={team.teamName}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  No {title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
