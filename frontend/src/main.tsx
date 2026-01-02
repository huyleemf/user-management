import { ApolloProvider } from "@apollo/client/react";
import {
  Backdrop,
  CircularProgress,
  GlobalStyles,
  StyledEngineProvider,
} from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Outlet, RouterProvider, useNavigation } from "react-router";
import { apolloClient } from "./apollo-client";
import "./index.css";
import { queryClient } from "./query-client";
import { store } from "./redux/store";
import router from "./routes";

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <html>
      <body>
        {isNavigating && (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={true}
          >
            <CircularProgress />
          </Backdrop>
        )}
        <Outlet />
      </body>
    </html>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <StyledEngineProvider enableCssLayer>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <SnackbarProvider
              anchorOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
            />
            <RouterProvider router={router} />
          </StyledEngineProvider>
        </Provider>
      </ApolloProvider>
    </QueryClientProvider>
  </StrictMode>
);
