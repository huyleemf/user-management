import { Box, Link, Stack, Typography } from "@mui/material";
import { useRouteError, isRouteErrorResponse } from "react-router";

export function RootErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100vh"}
      >
        <Stack spacing={2} textAlign="center">
          <Typography variant="h3" gutterBottom>
            {error.status} {error.statusText}
          </Typography>
          <Typography>{error.data}</Typography>
          <Link href="/dashboard">Go back to Home</Link>
        </Stack>
      </Box>
    );
  } else if (error instanceof Error) {
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100vh"}
      >
        <Stack spacing={2} padding={4}>
          <Typography>Error</Typography>
          <Typography>{error.message}</Typography>
          <Typography>The stack trace is:</Typography>
          <pre>{error.stack}</pre>
          <Link href="/dashboard">Go back to Home</Link>
        </Stack>
      </Box>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
