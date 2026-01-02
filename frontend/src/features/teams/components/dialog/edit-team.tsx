import EditIcon from "@mui/icons-material/Edit";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
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
import React from "react";
import type { GetTeamsResponse } from "../../api/types";
import { useGetTeamByIdQuery } from "../../queries/query";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
const EditTeamDialog: React.FC<{ teamId: string }> = ({ teamId }) => {
  const [open, setOpen] = React.useState(false);
  const {
    data: team,
    error,
    isLoading,
  } = useGetTeamByIdQuery(teamId, {
    enabled: open,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Team Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {!team && <Typography>No team data available.</Typography>}
          {isLoading && (
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
          )}
          {error && (
            <Typography color="error">Error loading team details.</Typography>
          )}
          {team && <TeamDetailTable team={team} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const TeamDetailTable: React.FC<{ team: GetTeamsResponse | undefined }> = ({
  team,
}) => {
  return (
    <Box
      sx={{
        maxWidth: 2000,
      }}
    >
      {team?.teamLeader && (
        <Stack>
          <Typography variant="body1">Team Leader</Typography>
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <EmojiPeopleIcon />
            <Typography
              variant="body1"
              sx={{
                textDecoration: "underline",
              }}
            >
              {team.teamLeader.username}
            </Typography>
          </Stack>
        </Stack>
      )}
      <Stack direction={"row"} gap={2} marginTop={2} marginBottom={2}>
        <Box>
          <Typography variant="body1" marginBottom={1}>
            Managers
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="team details table">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    <Button endIcon={<AddIcon />}>Add Manager</Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team?.managers?.map((manager) => (
                  <TableRow
                    key={manager.managerId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Chip label="Manager" />
                    </TableCell>
                    <TableCell>{manager.managerName}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box>
          <Typography variant="body1" marginBottom={1}>
            Members
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="team details table">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    <Button endIcon={<AddIcon />}>Add Member</Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team?.members?.map((member) => (
                  <TableRow
                    key={member.memberId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Chip label="Member" />
                    </TableCell>
                    <TableCell>{member.memberName}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Box>
  );
};
export default EditTeamDialog;
