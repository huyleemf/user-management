import { useCreateTeamMutation } from "@/data/teams/queries/mutation";
import type { CreateTeamRequest } from "@/data/teams/types";
import type { AppDispatch, RootState } from "@/redux/store";
import { userActions } from "@/redux/users/slice";
import { a11yProps } from "@/shared/utils/utils";
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
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TabsPanel from "./TabsPanel";

const CreateTeamDialog: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const { mutate } = useCreateTeamMutation();

  const form = useForm<CreateTeamRequest>();
  const dispatch = useDispatch<AppDispatch>();

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

  const onSubmit: SubmitHandler<CreateTeamRequest> = (data) =>
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        enqueueSnackbar("Team created successfully!", { variant: "success" });
      },
    });

  const handleSelectAll = () => {
    if (value === 1) {
      //eslint-disable-next-line
      if (form.watch("managers").length === managers.length) {
        form.setValue("managers", []);
        return;
      }
      const allManagers = managers.map((manager) => ({
        managerId: manager.userId,
        managerName: manager.username,
      }));
      form.setValue("managers", allManagers);
    } else {
      if (form.watch("members").length === members.length) {
        form.setValue("members", []);
        return;
      }
      const allMembers = members.map((member) => ({
        memberId: member.userId,
        memberName: member.username,
      }));
      form.setValue("members", allMembers);
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
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  {...form.register("teamName", {
                    required: "Team Name is required",
                  })}
                />
                {form.formState.errors.teamName && (
                  <span style={{ color: "red" }}>
                    {form.formState.errors.teamName.message}
                  </span>
                )}
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
                        <Typography fontWeight={500}>
                          Members In Team
                        </Typography>
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
                        <Typography fontWeight={500}>
                          Managers In Team
                        </Typography>
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
                      ? form.getValues("managers")?.length == managers.length
                        ? "Deselect"
                        : "Select"
                      : form.getValues("members")?.length == members.length
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
                  />
                  <TabsPanel
                    value={value}
                    index={1}
                    users={filteredManagers}
                    usersRole="MANAGER"
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
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </FormProvider>
  );
};

export default CreateTeamDialog;
