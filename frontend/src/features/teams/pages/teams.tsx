import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import CreateTeamDialog from "../components/dialog/create-team";
import { useGetTeamsQuery } from "../queries/query";
import TeamCard from "../components/card/team";
const Teams: React.FC = () => {
  const { data: teams, isLoading } = useGetTeamsQuery();
  const [searchValue, setSearchValue] = useState("");
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return (
      !!teams &&
      teams.length > 0 &&
      teams.filter((team) =>
        team.teamName.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, teams]);
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box>
        <Stack direction="row" alignContent={"center"} gap={2}>
          <CreateTeamDialog />
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
