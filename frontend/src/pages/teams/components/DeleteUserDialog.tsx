import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRemoveUserFromTeamMutation } from "@/data/teams/queries/mutation";

interface DeleteUserDialogProps {
  teamId: string;
  userId: string;
  username: string;
  role: "member" | "manager";
  teamName?: string;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  teamId,
  userId,
  username,
  role,
  teamName,
}) => {
  const [open, setOpen] = React.useState(false);
  const { mutate: removeUser, isPending } = useRemoveUserFromTeamMutation();

  const handleConfirm = () => {
    removeUser(
      { teamId, userId, role },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          console.error("Failed to remove user:", error);
        },
      }
    );
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Tooltip title="Remove User">
        <IconButton onClick={() => setOpen(true)} size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Remove {role === "manager" ? "Manager" : "Member"}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove <strong>{username}</strong> from{" "}
            {teamName ? `team "${teamName}"` : "this team"}?
            {role === "manager" && (
              <> This will remove their manager privileges.</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={isPending}
            autoFocus
          >
            {isPending ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteUserDialog;
