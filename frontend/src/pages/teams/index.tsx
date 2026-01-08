import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Activity, useMemo, useState } from "react";
import { storage } from "@/shared/utils/storage";
import { useAuthorization } from "@/shared/utils/roles";
import { useGetTeamsQuery } from "@/data/teams/queries/query";
import type { User } from "@/data/users/types";
import CreateTeamDialog from "./components/CreateTeamDialog";
import TeamCard from "./components/TeamCard";
const Teams: React.FC = () => {
  const { data: teams, isLoading } = useGetTeamsQuery();
  const user: User | null = storage.get("user");
  const [searchValue, setSearchValue] = useState("");
  const { isMember } = useAuthorization();
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return (
      !!teams &&
      teams.length > 0 &&
      teams.filter((team) => {
        const matchedTeam = team.teamName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const isAdmin = team.teamLeader.userId === user?.userId;
        const isMember = team.members.some(
          (member: any) => member.memberId === user?.userId
        );
        const isManager = team.managers.some(
          (manager: any) => manager.managerId === user?.userId
        );
        return matchedTeam && (isAdmin || isMember || isManager);
      })
    );
  }, [searchValue, teams, user]);
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box>
        <Stack direction="row" alignContent={"center"} gap={2}>
          <Activity
            mode={!isMember ? "visible" : "hidden"}
            children={<CreateTeamDialog />}
          />
          <Box>
            <TextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search Teams"
              variant="standard"
              sx={{
                backgroundColor: "#eee",
                paddingInline: 2,
              }}
              slotProps={{
                input: {
                  disableUnderline: true,
                  startAdornment: <SearchIcon sx={{ marginInlineEnd: 1 }} />,
                },
                htmlInput: {
                  sx: {
                    padding: 1,
                    border: 0,
                    outline: "none",
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </Box>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <CircularProgress /> <Typography>Loading teams...</Typography>
        </Box>
      )}
      {!!filteredTeams && filteredTeams.length === 0 && !isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <Typography> No teams found.</Typography>
        </Box>
      )}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {!!filteredTeams &&
          filteredTeams.length > 0 &&
          filteredTeams.map((team) => (
            <Grid size={{ xs: 6, md: 4 }}>
              <TeamCard key={team.teamId} card={team} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Teams;
