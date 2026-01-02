import { a11yProps } from "@/shared/utils/utils";
import Person2Icon from "@mui/icons-material/Person2";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [value, setValue] = useState<number>(() =>
    location === "/members"
      ? 0
      : location === "/managers"
      ? 1
      : location === "/teams"
      ? 2
      : 0
  );

  const handleChange = (newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/members");
        break;
      case 1:
        navigate("/managers");
        break;
      case 2:
        navigate("/teams");
        break;
      default:
        break;
    }
  };

  return (
    <Box boxShadow={2}>
      <Typography
        variant="h4"
        fontWeight={600}
        padding={2}
        component="h1"
        gutterBottom
      >
        User Management
      </Typography>
      <Box paddingInline={2}>
        <Tabs value={value} onChange={(_, newValue) => handleChange(newValue)}>
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Members</Typography>
                {/* <Chip
                  label={loading ? "..." : members.length}
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
                /> */}
              </Stack>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Managers</Typography>
                {/* <Chip
                  label={loading ? "..." : managers.length}
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
                /> */}
              </Stack>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Person2Icon />
                <Typography>Teams</Typography>
                {/* <Chip
                  label={loading ? "..." : managers.length}
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
                /> */}
              </Stack>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
