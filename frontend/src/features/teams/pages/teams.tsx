import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, Stack, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import CreateTeamDialog from "../components/create-team.dialog";
import TeamCard from "../components/team.card";
import { useGetTeamsQuery } from "../queries/query";
const Teams: React.FC = () => {
  const { data: teams } = useGetTeamsQuery();
  const [searchValue, setSearchValue] = useState("");
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return teams.filter((team) =>
      team.teamName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, teams]);
  console.log(teams);
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
