import { userActions } from "@/features/users/redux/slice";
import type { AppDispatch, RootState } from "@/redux/store";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { GetTeamsResponse } from "../../api/types";
import { useAddUserToTeamMutation } from "../../queries/mutation";
export type AddUserDialogType = "member" | "manager";

interface AddUserDialogProps {
  type: AddUserDialogType;
  team: GetTeamsResponse;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ type, team }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ userId: string; username: string }>({
    userId: "",
    username: "",
  });

  const { managers, members } = useSelector((state: RootState) => state.user);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { mutate, isPending } = useAddUserToTeamMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      teamId: team.teamId,
      userId: user.userId,
      username: user.username,
      role: type,
    });
    handleClose();
  };

  const isMemberType = type === "member";
  const label = isMemberType ? "Member" : "Manager";
  const userList = isMemberType ? members : managers;
  const targetTeam = team.teamName ?? "This Team";
  useEffect(() => {
    if (type === "member") {
      dispatch(userActions.fetchMembersRequested());
    } else if (type === "manager") {
      dispatch(userActions.fetchManagersRequested());
    }
  }, [type, dispatch]);
  return (
    <Box component={"div"}>
      <Button endIcon={<AddIcon />} onClick={handleClickOpen}>
        Add {type == "member" ? "Member" : "Manager"}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add User to {targetTeam}</DialogTitle>

        <DialogContent dividers>
          <DialogContentText sx={{ mb: 3 }}>
            To add a <strong>{label.toLowerCase()}</strong> to the team, please
            select from the list below.
          </DialogContentText>

          <form id="subscription-form" onSubmit={handleSubmit}>
            <Stack
              direction={"row"}
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <FormControl fullWidth>
                <Autocomplete
                  options={type === "member" ? members : managers}
                  getOptionLabel={(option) =>
                    `${option.username} (${option.email})`
                  }
                  value={userList.find((u) => u.userId === user.userId) || null}
                  onChange={(_, value) => {
                    setUser(
                      value
                        ? {
                            userId: value.userId,
                            username: value.username,
                          }
                        : {
                            userId: "",
                            username: "",
                          }
                    );
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>

              <ArrowForwardIosIcon color="action" sx={{ transform: "none" }} />

              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  border: "1px dashed grey",
                  borderRadius: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="primary">
                  {targetTeam}
                </Typography>
                <Typography variant="caption" display="block">
                  Destination
                </Typography>
                <Typography variant="body1" display="block">
                  {user.username || "No user selected"}
                </Typography>
              </Box>
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="subscription-form"
            disabled={isPending || !user.userId}
            variant="contained"
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddUserDialog;
