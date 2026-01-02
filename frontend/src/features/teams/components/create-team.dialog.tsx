import { userActions } from "@/features/users/redux/slice";
import { a11yProps } from "@/features/users/utils/utils";
import type { AppDispatch, RootState } from "@/redux/store";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupIcon from "@mui/icons-material/Group";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateTeamRequest } from "../api/types";
import { useCreateTeamMutation } from "../queries/mutation";
import TabsPanel from "./tabs-panel";
import { enqueueSnackbar } from "notistack";

const CreateTeamDialog: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [formData, setFormData] = useState<CreateTeamRequest>({
    teamName: "",
    managers: [],
    members: [],
  });
  const dispatch = useDispatch<AppDispatch>();

  const { mutate } = useCreateTeamMutation();

  const { managers, members, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (value === 1) {
      dispatch(userActions.fetchManagersRequested());
    } else {
      dispatch(userActions.fetchMembersRequested());
    }
  }, [dispatch, value]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleUpdateFormData = useCallback(
    (key: keyof CreateTeamRequest, value: any) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          teamName: "",
          managers: [],
          members: [],
        });
        enqueueSnackbar("Team created successfully!", { variant: "success" });
      },
    });
  };

  const handleSelectAll = () => {
    if (value === 1) {
      if (formData.managers.length === managers.length) {
        handleUpdateFormData("managers", []);
        return;
      }
      const allManagers = managers.map((manager) => ({
        managerId: manager.userId,
        managerName: manager.username,
      }));
      handleUpdateFormData("managers", allManagers);
    } else {
      if (formData.members.length === members.length) {
        handleUpdateFormData("members", []);
        return;
      }
      const allMembers = members.map((member) => ({
        memberId: member.userId,
        memberName: member.username,
      }));
      handleUpdateFormData("members", allMembers);
    }
  };
  const filteredMembers = members.filter(
    (member) =>
      member.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.email.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filteredManagers = managers.filter(
    (manager) =>
      manager.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleOpen = () => setOpen(!open);
  console.log(formData);
  return (
    <div>
      <Button
        variant="contained"
        onClick={toggleOpen}
        startIcon={<GroupAddIcon />}
      >
        Create New Team
      </Button>
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle
          sx={{
            paddingBottom: 0,
          }}
          fontWeight={600}
        >
          New Team
        </DialogTitle>
        <DialogContent
          sx={{
            padding: 0,
          }}
        >
          <Stack spacing={2} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Box
              sx={{
                paddingInline: 3,
              }}
            >
              <TextField
                label="Team Name"
                variant="filled"
                fullWidth
                value={formData.teamName}
                onChange={(e) =>
                  handleUpdateFormData("teamName", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%", paddingInline: 3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <GroupIcon />
                      <Typography fontWeight={500}>Members In Team</Typography>
                      <Box>
                        <Chip
                          label={members.length}
                          variant={value == 0 ? "filled" : "outlined"}
                          color={value == 0 ? "primary" : "default"}
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
                        />
                      </Box>
                    </Stack>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AssignmentIndIcon />
                      <Typography fontWeight={500}>Managers In Team</Typography>
                      <Box>
                        <Chip
                          label={managers.length}
                          variant={value == 1 ? "filled" : "outlined"}
                          color={value == 1 ? "primary" : "default"}
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
                        />
                      </Box>
                    </Stack>
                  }
                  {...a11yProps(1)}
                />
              </Tabs>

              <Box
                sx={{ marginTop: 2 }}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"end"}
              >
                <TextField
                  fullWidth
                  onChange={(e) => setSearchValue(e.currentTarget.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: <SearchIcon />,
                    },
                    htmlInput: {
                      style: {
                        padding: 8,
                      },
                    },
                  }}
                  placeholder={`Search ${
                    value == 1 ? managers.length : members.length
                  } ${value == 1 ? "managers" : "members"}`}
                />
                <Button
                  variant="text"
                  sx={{
                    marginTop: 1,
                    padding: 0,
                    fontWeight: 500,
                  }}
                  onClick={handleSelectAll}
                >
                  {value == 1
                    ? formData.managers.length == managers.length
                      ? "Deselect"
                      : "Select"
                    : formData.members.length == members.length
                    ? "Deselect"
                    : "Select"}{" "}
                  All {value == 1 ? managers.length : members.length}
                </Button>
              </Box>
            </Box>
            {loading ? (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={1}
              >
                <CircularProgress /> <Typography>Loading users...</Typography>
              </Box>
            ) : error ? (
              <Typography color={"error"}>Error: {error}</Typography>
            ) : (
              <Box
                sx={{
                  marginTop: 0,
                }}
              >
                <TabsPanel
                  value={value}
                  index={0}
                  users={filteredMembers}
                  usersRole="MEMBER"
                  onUpdateFormData={handleUpdateFormData}
                  formData={formData}
                />
                <TabsPanel
                  value={value}
                  index={1}
                  users={filteredManagers}
                  usersRole="MANAGER"
                  onUpdateFormData={handleUpdateFormData}
                  formData={formData}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={toggleOpen}
            sx={{
              color: "GrayText",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              formData.teamName.trim() === "" ||
              (formData.members.length === 0 && formData.managers.length === 0)
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTeamDialog;
