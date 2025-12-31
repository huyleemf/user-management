import SearchIcon from "@mui/icons-material/Search";
import { Box, Container, Stack, TextField } from "@mui/material";
import React from "react";
import CreateTeamDialog from "../components/create-team.dialog";
const Teams: React.FC = () => {
  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Box>
        <Stack direction="row" alignContent={"center"} gap={2}>
          <CreateTeamDialog />
          <Box>
            <TextField
              sx={{
                backgroundColor: "#ddd",
              }}
              slotProps={{
                input: {
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
      <Box></Box>
    </Container>
  );
};

export default Teams;
