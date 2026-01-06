import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Outlet, RouterProvider } from "react-router";
import { apolloClient } from "./apollo-client";
import { queryClient } from "./query-client";
import { store } from "./redux/store";
import router from "./routes";
import { useNavigation } from "react-router";
import {
  Backdrop,
  CircularProgress,
  GlobalStyles,
  StyledEngineProvider,
} from "@mui/material";
import "./index.css";

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
            <RouterProvider router={router} />
          </StyledEngineProvider>
        </Provider>
      </ApolloProvider>
    </QueryClientProvider>
  </StrictMode>
);
