import { useGetTeamByIdQuery } from "@/features/teams/queries/query";
import type { AppDispatch, RootState } from "@/redux/store";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/slice";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
interface TeamDetailDialogProps {
  userId: string;
}
const TeamDetailDialog: React.FC<TeamDetailDialogProps> = ({ userId }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { userTeam } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userId) return;
    if (!open) return;
    dispatch(userActions.fetchUserTeamsRequested(userId));
  }, [dispatch, userId, open]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        View Team
      </Button>
      <Dialog maxWidth="md" onClose={handleClose} open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Team Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            minWidth: 650,
          }}
          dividers
        >
          {(!userTeam || userTeam.length === 0) && (
            <Stack>
              <Typography>No team data available.</Typography>
            </Stack>
          )}
          {!!userTeam &&
            userTeam.length > 0 &&
            userTeam.map((team, index) => (
              <Box key={team.teamId} marginBottom={2}>
                <Stack>
                  <Typography variant="h6" fontWeight={600}>
                    {team.teamName}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    Roster Count : {team.rosterCount}
                  </Typography>
                </Stack>
                <TeamDetailTable teamId={team.teamId} />
                {index !== userTeam.length - 1 && (
                  <Divider sx={{ marginTop: 2 }} />
                )}
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK !
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const TeamDetailTable: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { data: team, error, isLoading } = useGetTeamByIdQuery(teamId);
  if (isLoading) {
    return (
      <Stack
        direction={"row"}
        gap={2}
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <CircularProgress />

        <Typography>Loading team details...</Typography>
      </Stack>
    );
  }
  if (error) {
    return <Typography color="error">Error loading team details.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="team details table">
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {team?.teamLeader && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Chip
                  variant="filled"
                  color="primary"
                  label={
                    <Stack direction={"row"} alignItems="center" gap={1}>
                      <EmojiPeopleIcon />
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: "underline",
                        }}
                      >
                        Team Leader
                      </Typography>
                    </Stack>
                  }
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: "underline",
                  }}
                >
                  {team.teamLeader.username}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {team?.managers?.map((manager) => (
            <TableRow
              key={manager.managerId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Chip label="Manager" />
              </TableCell>
              <TableCell>{manager.managerName}</TableCell>
            </TableRow>
          ))}
          {team?.members?.map((member) => (
            <TableRow
              key={member.memberId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Chip label="Member" />
              </TableCell>
              <TableCell>{member.memberName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamDetailDialog;
